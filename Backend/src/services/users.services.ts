import { envConfig } from '~/constants/config'
import { TokenType } from '~/constants/enums'
import { RegisterRequestBody } from '~/models/requests/users.requests'
import User, { UserType } from '~/models/schemas/User.schema'
import { UserRoles } from '~/models/schemas/UserRoles.schema'
import databaseService from '~/services/database.services'
import { UUIDv4 } from '~/types/common'
import { hashPassword } from '~/utils/crypto'
import { signToken, verifyToken } from '~/utils/jwt'

class UserService {
  private signAccessToken({ user_id }: { user_id: UUIDv4 }): Promise<string> {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken
      },
      privateKey: envConfig.jwtSecretAccessToken as string,
      options: {
        expiresIn: envConfig.accessTokenExpiresIn as any
      }
    }) as Promise<string>
  }

  private signRefreshToken({ user_id, exp }: { user_id: UUIDv4; exp?: number }): Promise<string> {
    if (exp) {
      return signToken({
        payload: {
          user_id,
          token_type: TokenType.RefreshToken,
          exp
        },
        privateKey: envConfig.jwtSecretRefreshToken as string
      }) as Promise<string>
    }
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken
      },
      privateKey: envConfig.jwtSecretRefreshToken as string,
      options: {
        expiresIn: envConfig.refreshTokenExpiresIn as any
      }
    }) as Promise<string>
  }

  private async signAccessAndRefreshToken({ user_id }: { user_id: UUIDv4 }): Promise<[string, string]> {
    const access_token = await this.signAccessToken({ user_id })
    const refresh_token = await this.signRefreshToken({ user_id })
    return [access_token, refresh_token]
  }

  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: envConfig.jwtSecretRefreshToken as string
    })
  }

  async register(payload: RegisterRequestBody) {
    const { name, email, password, role } = payload
    const password_hash = hashPassword(password)
    const new_user = new User({
      name,
      email,
      password_hash
    })
    const result = Promise.all([
      await databaseService.users<UserType>(
        `INSERT INTO users(id, name, email, password_hash) VALUES($1, $2, $3, $4)`,
        [new_user.id, new_user.name, new_user.email, new_user.password_hash]
      ),
      await databaseService.user_roles<UserRoles>(`INSERT INTO user_roles (user_id, role) VALUES ($1, $2)`, [
        new_user.id,
        role || 'attendee'
      ])
    ])
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id: new_user.id
    })
    return {
      access_token,
      refresh_token
    }
  }
  async checkEmailExist(email: string) {
    const result = await databaseService.users<UserType>(`SELECT id FROM users WHERE users.email=$1`, [email])
    return result.rows.length > 0
  }
}

const userService = new UserService()
export default userService
