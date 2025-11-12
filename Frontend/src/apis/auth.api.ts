import type { AuthResponse, GetMeResponse } from '../types/auth.types'
import http from '../utils/http'

export interface RegisterRequest {
  name: string
  email: string
  password: string
  confirm_password: string
}

export interface LoginRequest {
  email: string
  password: string
}

const authApi = {
  registerAccount: (body: RegisterRequest) => {
    return http.post<AuthResponse>('/users/register', body)
  },
  loginAccount: (body: LoginRequest) => {
    return http.post<AuthResponse>('/users/login', body)
  },
  logout: () => {
    return http.post('/users/logout')
  },
  getMe: () => {
    return http.get<GetMeResponse>('/users/me')
  }
}

export default authApi
