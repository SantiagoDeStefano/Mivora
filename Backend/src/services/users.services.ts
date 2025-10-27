import { envConfig } from '~/constants/config'
import { TokenType } from '~/constants/enums'
import { RegisterRequestBody, UpdateMeRequestBody } from '~/models/requests/users.requests'
import { UUIDv4 } from '~/types/common'
import { hashPassword } from '~/utils/crypto'
import { signToken, verifyToken } from '~/utils/jwt'
import { USERS_MESSAGES } from '~/constants/messages'

import RefreshToken from '~/models/schemas/RefreshToken.schema'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import { parsePgArray } from '~/utils/common'
import { UserVerificationStatus } from '~/types/domain'
import { sendVerifyStatusEmail } from '~/utils/email'

class UserService {
  // Signs a short-lived Access Token (used on every API call). Lifetime comes from envConfig.accessTokenExpiresIn.
  private signAccessToken({ user_id, verify }: { user_id: UUIDv4; verify: UserVerificationStatus }): Promise<string> {
    return signToken({
      payload: {
        user_id,
        verify,
        token_type: TokenType.AccessToken
      },
      privateKey: envConfig.jwtSecretAccessToken as string,
      options: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expiresIn: envConfig.accessTokenExpiresIn as any
      }
    }) as Promise<string>
  }

  // Signs a Refresh Token. If exp (unix seconds) is provided, it is embedded directly; otherwise uses configured expiresIn.
  // This dual mode enables rotation while preserving original expiration when desired.
  private signRefreshToken({
    user_id,
    verify,
    exp
  }: {
    user_id: UUIDv4
    verify: UserVerificationStatus
    exp?: number
  }): Promise<string> {
    if (exp) {
      return signToken({
        payload: {
          user_id,
          verify,
          token_type: TokenType.RefreshToken,
          exp
        },
        privateKey: envConfig.jwtSecretRefreshToken as string
      }) as Promise<string>
    }
    return signToken({
      payload: {
        user_id,
        verify,
        token_type: TokenType.RefreshToken
      },
      privateKey: envConfig.jwtSecretRefreshToken as string,
      options: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expiresIn: envConfig.refreshTokenExpiresIn as any
      }
    }) as Promise<string>
  }

  // Convenience helper: signs both tokens in parallel sequence for a given user.
  private async signAccessAndRefreshToken({
    user_id,
    verify
  }: {
    user_id: UUIDv4
    verify: UserVerificationStatus
  }): Promise<[string, string]> {
    const access_token = await this.signAccessToken({ user_id, verify })
    const refresh_token = await this.signRefreshToken({ user_id, verify })
    return [access_token, refresh_token]
  }

  private signEmailVerifyToken({
    user_id,
    verify
  }: {
    user_id: string
    verify: UserVerificationStatus
  }): Promise<string> {
    return signToken({
      payload: {
        user_id,
        verify,
        token_type: TokenType.EmailVerifyToken
      },
      privateKey: envConfig.jwtSecretEmailVerifyToken as string,
      options: {
        expiresIn: envConfig.emailVerifyTokenExpiresIn as any
      }
    }) as Promise<string>
  }

  // Decodes/validates a refresh token using the refresh secret. Returns payload (expects iat/exp in seconds).
  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: envConfig.jwtSecretRefreshToken as string
    })
  }

  // Registers a new user, creates a role row, issues tokens, and persists the refresh token record.
  async register(payload: RegisterRequestBody) {
    const { name, email, password, role, avatar_url } = payload
    const password_hash = hashPassword(password) // Hashing password before storing (uses sha256 in hashPassword).

    const new_user = new User({
      name,
      email,
      password_hash,
      avatar_url
    })

    await Promise.all([
      databaseService.users(
        `INSERT INTO users(id, name, email, password_hash, email_verify_token, forgot_password_token, avatar_url, verified) VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          new_user.id,
          new_user.name,
          new_user.email,
          new_user.password_hash,
          new_user.email_verify_token,
          new_user.forgot_password_token,
          new_user.avatar_url,
          new_user.verified
        ]
      ),
      databaseService.user_roles(`INSERT INTO user_roles (user_id, role) VALUES ($1, $2)`, [
        new_user.id,
        role || 'attendee'
      ])
    ])

    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id: new_user.id,
      verify: 'unverified'
    })
    const { iat, exp } = await this.decodeRefreshToken(refresh_token) // iat/exp are unix seconds from JWT.

    await databaseService.refresh_tokens(
      `INSERT INTO refresh_tokens (user_id, token_hash, iat, exp) VALUES ($1, $2, to_timestamp($3), to_timestamp($4))`,
      [new_user.id, refresh_token, iat, exp] // token_hash column expects hashed value; ensure refresh_token is already hashed upstream.
    )

    return {
      access_token,
      refresh_token
    }
  }

  // Issues a fresh token pair for an existing user and stores the refresh token record.
  async login(user_id: UUIDv4, verify: UserVerificationStatus) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({ user_id, verify })
    const { iat, exp } = await this.decodeRefreshToken(refresh_token)

    const refreshToken = new RefreshToken({
      user_id: user_id,
      token_hash: refresh_token,
      iat,
      exp
    })

    await databaseService.refresh_tokens(
      `INSERT INTO refresh_tokens (id, user_id, token_hash, iat, exp) VALUES ($1, $2, $3, to_timestamp($4), to_timestamp($5))`,
      [refreshToken.id, refreshToken.user_id, refreshToken.token_hash, refreshToken.iat, refreshToken.exp]
    )

    return {
      access_token,
      refresh_token
    }
  }

  // Logs out a single session by deleting the refresh token row. Access token naturally expires on its own.
  async logout(refresh_token: string) {
    await databaseService.refresh_tokens(`DELETE FROM refresh_tokens WHERE token_hash=$1`, [refresh_token])
    return {
      message: USERS_MESSAGES.LOGOUT_SUCCESS
    }
  }

  // Fast existence check for email (returns boolean). Use LIMIT 1 to reduce result size.
  async checkEmailExist(email: string) {
    const userRow = await databaseService.users(`SELECT id FROM users WHERE email=$1 LIMIT 1`, [email])
    return userRow.rows.length > 0
  }

  async checkRoleExist(user_id: UUIDv4, role: string) {
    const userRow = await databaseService.user_roles(`SELECT role FROM user_roles WHERE user_id=$1 AND role=$2`, [
      user_id,
      'organizer'
    ])
    return userRow.rows.length > 0
  }

  // Refresh flow: issues new access + refresh tokens, deletes the old refresh token, and inserts the new one.
  // Keeps the same exp for the new refresh token if provided (rotation with preserved expiry).
  async refreshToken({
    user_id,
    refresh_token,
    verify,
    exp
  }: {
    user_id: UUIDv4
    refresh_token: string
    verify: UserVerificationStatus
    exp: number
  }) {
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, verify }),
      this.signRefreshToken({ user_id, verify, exp }),
      databaseService.refresh_tokens(`DELETE FROM refresh_tokens WHERE token_hash=$1`, [refresh_token]) // Remove old token to prevent reuse.
    ])

    const decoded_refresh_token = await this.decodeRefreshToken(new_refresh_token)

    const refreshToken = new RefreshToken({
      user_id: user_id,
      token_hash: new_refresh_token, // Store hash value; ensure upstream hashing is consistent with DB.
      iat: decoded_refresh_token.iat,
      exp: decoded_refresh_token.exp
    })

    await databaseService.refresh_tokens(
      `INSERT INTO refresh_tokens (id, user_id, token_hash, iat, exp) VALUES ($1, $2, $3, to_timestamp($4), to_timestamp($5))`,
      [refreshToken.id, refreshToken.user_id, new_refresh_token, refreshToken.iat, refreshToken.exp]
    )

    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token
    }
  }

  async getMe(user_id: UUIDv4) {
    const user = await databaseService.users(
      `SELECT users.name, users.email, users.avatar_url, users.verified, ARRAY_AGG(user_roles.role) AS role FROM users JOIN user_roles ON users.id = user_roles.user_id WHERE id=$1 GROUP BY users.id, users.name, users.email, users.avatar_url;`,
      [user_id]
    )
    user.rows[0].role = parsePgArray(user.rows[0].role)
    return user.rows[0]
  }

  async updateMe(user_id: UUIDv4, body: UpdateMeRequestBody) {
    const { name, avatar_url, role } = body
    const newName = name ? name : ''
    const newAvatarUrl = avatar_url ? avatar_url : ''

    await databaseService.users(`UPDATE users SET name=$1, avatar_url=$2 WHERE id=$3`, [newName, newAvatarUrl, user_id])
    if (role) {
      await databaseService.user_roles(`INSERT INTO user_roles(user_id, role) VALUES($1, $2)`, [user_id, role])
    }
    const updatedUser = await databaseService.users(
      `SELECT users.name, users.email, users.avatar_url, ARRAY_AGG(user_roles.role) AS role FROM users JOIN user_roles ON users.id = user_roles.user_id WHERE id=$1 GROUP BY users.id, users.name, users.email, users.avatar_url;`,
      [user_id]
    )
    updatedUser.rows[0].role = parsePgArray(updatedUser.rows[0].role)
    return updatedUser.rows[0]
  }

  async sendEmailVerifyToken(user_id: UUIDv4, email: string) {
    const email_verify_token = await this.signEmailVerifyToken({ user_id, verify: 'unverified' })
    console.log('email_verify_token: ', email_verify_token)

    await sendVerifyStatusEmail(email, email_verify_token)
    await databaseService.users(`UPDATE users SET email_verify_token=$1 WHERE id=$2`, [email_verify_token, user_id])
  }

  async verifyEmail(user_id: UUIDv4) {
    //Declare update value
    const [tokens] = await Promise.all([
      this.signAccessAndRefreshToken({ user_id, verify: 'verified' }),

      databaseService.users(`UPDATE users SET verified=$1, email_verify_token=$2 WHERE id=$3`, [
        'verified',
        '',
        user_id
      ])
    ])

    const [access_token, refresh_token] = tokens

    const { iat, exp } = await this.decodeRefreshToken(refresh_token)

    const refreshToken = new RefreshToken({
      user_id: user_id,
      token_hash: refresh_token,
      iat,
      exp
    })

    await databaseService.refresh_tokens(
      `INSERT INTO refresh_tokens (id, user_id, token_hash, iat, exp) VALUES ($1, $2, $3, to_timestamp($4), to_timestamp($5))`,
      [refreshToken.id, refreshToken.user_id, refreshToken.token_hash, refreshToken.iat, refreshToken.exp]
    )

    return {
      access_token,
      refresh_token
    }
  }
}

const userService = new UserService()
export default userService
