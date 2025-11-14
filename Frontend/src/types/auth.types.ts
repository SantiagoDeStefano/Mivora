import { User } from './user.types'
import { SuccessResponse } from './util.types'

export type GetMeResponse = SuccessResponse<User>

export type AuthResponse = SuccessResponse<{
  access_token: string
  refresh_token: string
}>

export interface MessageOnly {
  message: string
}
