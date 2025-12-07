import { LoginSchema, RegisterSchema, UpdateMeSchema } from '../utils/rules'
import type { AuthResponse, GetMeResponse, MessageOnly } from '../types/auth.types'
import { SuccessResponse } from '../types/response.types'
import { Event, GetEventsResponse } from './events.api'
import http from '../utils/http'

export interface RefreshTokenRequest {
  refresh_token: string
}
export interface EmailTokenRequest {
  email_verify_token: string
}
export interface ForgotPasswordRequest {
  forgot_password_token: string
}
export type ResetPasswordPayload = {
  password: string
  confirm_password: string
  forgot_password_token: string
}
const usersApi = {
  registerAccount: (body: RegisterSchema) => {
    return http.post<AuthResponse>('/api/v1/users/register', body)
  },
  loginAccount: (body: LoginSchema) => {
    return http.post<AuthResponse>('/api/v1/users/login', body)
  },
  logout: (body: RefreshTokenRequest) => {
    return http.post<MessageOnly>('/api/v1/users/logout', body)
  },
  refreshToken: (body: RefreshTokenRequest) => {
    return http.post<AuthResponse>('/api/v1/users/refresh-token', body)
  },
  getMe: () => {
    return http.get<GetMeResponse>('/api/v1/users/me')
  },
  updateMe: (body: UpdateMeSchema) => {
    return http.patch<GetMeResponse>('/api/v1/users/me', body)
  },
  updateAvatar: (formData: FormData) => {
    return http.put<GetMeResponse>('/api/v1/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  sendVerifyEmail: () => {
    return http.post<MessageOnly>('/api/v1/users/me/email-verification')
  },
  forgotPassword: (email: string) => {
    return http.post<MessageOnly>('/api/v1/users/forgot-password', { email })
  },
  verifyEmail: (body: EmailTokenRequest) => {
    return http.post<MessageOnly>('/api/v1/users/verify-email', body)
  },
  verifyForgotPassword: (body: ForgotPasswordRequest) => {
    return http.post<MessageOnly>('/api/v1/users/verify-forgot-password', body)
  },
  resetPassword: (body: ResetPasswordPayload) => {
    return http.post<MessageOnly>('/api/v1/users/reset-password', body)
  },
  searchEventsOrganizer: (q: string, limit: number = 20, page: number = 1) => {
    return http.get<SuccessResponse<GetEventsResponse>>('/api/v1/users/me/events', {
      params: { q, limit, page }
    })
  },
  getCreatedEventDetails: (event_id: string) => {
    return http.get<SuccessResponse<Event>>(`/api/v1/users/me/events/${event_id}`)
  },
  getCreatedEvents: (limit: number = 20, page: number = 1) => {
    return http.get<SuccessResponse<GetEventsResponse>>('/api/v1/users/me/events', {
      params: { limit, page }
    })
  }
}

export default usersApi
