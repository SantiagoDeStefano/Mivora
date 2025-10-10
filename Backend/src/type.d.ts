import {} from 'express'
import { TokenPayload } from './models/requests/users.requests'
import { UUIDv4 } from './types/common'

import Tweet from './models/schemas/Tweet.schema'

declare module 'express' {
  interface Request {
    user_id?: UUIDv4 // User.id
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
    decoded_forgot_password_token?: TokenPayload
  }
}
