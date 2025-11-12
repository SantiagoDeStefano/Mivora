import { User } from './user.types'

export interface GetMeResponse {
  message: string
  result: User
}

export interface AuthResponse {
  message: string
  result: {
    access_token: string
    refresh_token: string
  }
}
