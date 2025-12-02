import { LoginSchema, RegisterSchema, UpdateMeSchema } from '../utils/rules'
import type { AuthResponse, GetMeResponse, MessageOnly } from '../types/auth.types'
import http from '../utils/http'

export interface RefreshTokenRequest {
  refresh_token: string
}
export interface EmailTokenRequest {
  email_verify_token: string
}

const usersApi = {
  registerAccount: (body: RegisterSchema) => {
    return http.post<AuthResponse>('/users/register', body)
  },
  loginAccount: (body: LoginSchema) => {
    return http.post<AuthResponse>('/users/login', body)
  },
  logout: (body: RefreshTokenRequest) => {
    return http.post<MessageOnly>('/users/logout', body)
  },
  refreshToken: (body: RefreshTokenRequest) => {
    return http.post<AuthResponse>('/users/refresh-token', body)
  },
  getMe: () => {
    return http.get<GetMeResponse>('/users/me')
  },
  updateMe: (body: UpdateMeSchema) => {
    return http.patch<GetMeResponse>('/users/me', body)
  },
  updateAvatar: (formData: FormData) => {
    return http.put<GetMeResponse>('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  sendVerifyEmail: () => {
    return http.post<MessageOnly>('/users/me/email-verification')
  },
  verifyEmail: (body: EmailTokenRequest) => {
    return http.post<MessageOnly>('/users/verify-email', body)
  }
}

export default usersApi
