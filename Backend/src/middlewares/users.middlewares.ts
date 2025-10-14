import { checkSchema, ParamSchema } from 'express-validator'
import { USERS_MESSAGES } from '~/constants/messages'
import { validate } from '~/utils/validation'
import { UserRole } from '~/types/domain'
import { hashPassword } from '~/utils/crypto'
import { verifyAccessToken } from '~/utils/common'
import { Request, Response } from 'express'
import { verifyToken } from '~/utils/jwt'
import { envConfig } from '~/constants/config'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import { NextFunction } from 'express-serve-static-core'
import { TokenPayload } from '~/models/requests/users.requests'

import userService from '~/services/users.services'
import databaseService from '~/services/database.services'
import ErrorWithStatus from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import LIMIT_MIN_MAX from '~/constants/limits'

// Allowed user roles
const user_roles: UserRole[] = ['attendee', 'organizer']

// Shared password rules
const passwordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
  },
  isLength: {
    options: { min: LIMIT_MIN_MAX.PASSWORD_LENGTH_MIN, max: LIMIT_MIN_MAX.PASSWORD_LENGTH_MAX },
    errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_FROM_8_TO_24
  },
  isStrongPassword: {
    options: {
      minLength: LIMIT_MIN_MAX.STRONG_PASSWORD_MIN_LENGTH,
      minLowercase: LIMIT_MIN_MAX.STRONG_PASSWORD_MIN_LOWERCASE,
      minUppercase: LIMIT_MIN_MAX.STRONG_PASSWORD_MIN_UPPERCASE,
      minNumbers: LIMIT_MIN_MAX.STRONG_PASSWORD_MIN_NUMBER,
      minSymbols: LIMIT_MIN_MAX.STRONG_PASSWORD_MIN_SYMBOL
    },
    errorMessage: USERS_MESSAGES.STRONG_PASSWORD
  }
}

// Shared name rules
const nameSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING
  },
  isLength: {
    options: {
      min: LIMIT_MIN_MAX.NAME_LENGTH_MIN,
      max: LIMIT_MIN_MAX.NAME_LENGTH_MAX
    },
    errorMessage: USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_3_TO_100
  },
  trim: true
}

// Optional avatar URL rules
const imageSchema: ParamSchema = {
  trim: true,
  optional: true,
  isString: {
    errorMessage: USERS_MESSAGES.IMAGE_URL_MUST_BE_A_STRING
  },
  isLength: {
    options: {
      min: LIMIT_MIN_MAX.IMAGE_LENGTH_MIN,
      max: LIMIT_MIN_MAX.IMAGE_LENGTH_MAX
    },
    errorMessage: USERS_MESSAGES.IMAGE_URL_MUST_BE_BETWEEN_1_AND_400
  }
}

// Confirm-password must match another field
const confirmPasswordSchema = (customField: string): ParamSchema => ({
  notEmpty: {
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
  },
  isLength: {
    options: { min: LIMIT_MIN_MAX.PASSWORD_LENGTH_MIN, max: LIMIT_MIN_MAX.PASSWORD_LENGTH_MAX },
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_FROM_8_TO_24
  },
  custom: {
    options: (value, { req }) => {
      if (value !== req.body[customField]) {
        throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_DOES_NOT_MATCH_PASSWORD)
      }
      return true
    }
  }
})

// Register: validate body fields and unique email
export const registerValidator = validate(
  checkSchema(
    {
      name: nameSchema,
      email: {
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
          options: async (value) => {
            const isExistEmail = await userService.checkEmailExist(value)
            if (isExistEmail) {
              throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS)
            }
            return true
          }
        }
      },
      password: passwordSchema,
      confirm_password: confirmPasswordSchema('password'),
      role: {
        optional: { options: { nullable: true } },
        isString: {
          errorMessage: USERS_MESSAGES.ROLE_MUST_BE_A_STRING
        },
        isIn: {
          options: [user_roles],
          errorMessage: USERS_MESSAGES.ROLE_MUST_BE_ATTENDEE_OR_ORGANIZER
        }
      },
      avatar_url: imageSchema
    },
    ['body']
  )
)

// Login: check email/password combo against DB and attach user_id
export const loginValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const userRow = await databaseService.users(`SELECT id FROM users WHERE email=$1 AND password_hash=$2`, [
              value,
              hashPassword(req.body.password)
            ])
            if (userRow.rows.length <= 0) {
              throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
            }
            req.user_id = userRow.rows[0].id
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
        }
      }
    },
    ['body']
  )
)

// Access token: verify "Authorization: Bearer <token>" header
export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value: string, { req }) => {
            const access_token = (value || '').split(' ')[1]
            return await verifyAccessToken(access_token, req as Request)
          }
        }
      }
    },
    ['headers']
  )
)

// Refresh token: verify JWT and ensure it exists in DB (not reused)
export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.ACCESS_TOKEN_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            try {
              // Verify token and check presence in persistence
              const [decoded_refresh_token, refresh_token_row] = await Promise.all([
                verifyToken({
                  token: value,
                  secretOrPublicKey: envConfig.jwtSecretRefreshToken as string
                }),
                databaseService.refresh_tokens(`SELECT token_hash FROM refresh_tokens WHERE token_hash=$1`, [value])
              ])
              if (refresh_token_row.rows.length <= 0) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              // Attach decoded payload for downstream handlers
              req.decoded_refresh_token = decoded_refresh_token
            } catch (error) {
              // Normalize JWT errors to 401 with capitalized message
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize((error as JsonWebTokenError).message),
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              // Re-throw non-JWT errors
              throw error
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

// User's role: verify event's creator role is 'organizer'
export const organizerValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const role = await databaseService.user_roles(`SELECT role FROM user_roles WHERE user_id=$1 AND role=$2`, [
    user_id,
    'organizer'
  ])
  if (role.rows.length <= 0) {
    return next(
      new ErrorWithStatus({
        message: USERS_MESSAGES.EVENT_CREATOR_MUST_BE_ORGANIZER,
        status: HTTP_STATUS.FORBIDDEN
      })
    )
  }
  next()
}

// Validator for updating user info, allowing only name, avatar, and role change to 'organizer' if not already assigned
export const updateMeValidator = validate(
  checkSchema(
    {
      name: nameSchema,
      avatar_url: imageSchema,
      role: {
        optional: { options: { nullable: true } },
        isString: {
          errorMessage: USERS_MESSAGES.ROLE_MUST_BE_A_STRING
        },
        isIn: {
          options: [user_roles[1]],
          errorMessage: USERS_MESSAGES.UPDATE_ROLE_MUST_BE_ORGANIZER
        },
        custom: {
          options: async (value, { req }) => {
            // Only allow changing to 'organizer'
            if (value != 'organizer') {
              throw new Error(USERS_MESSAGES.UPDATE_ROLE_MUST_BE_ORGANIZER)
            }
            // Prevent updating to the same role
            const { user_id } = req.decoded_authorization
            const isExistRole = await userService.checkRoleExist(user_id, value)
            if (isExistRole) {
              throw new Error(USERS_MESSAGES.USER_ALREADY_HAVE_THIS_ROLE)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
