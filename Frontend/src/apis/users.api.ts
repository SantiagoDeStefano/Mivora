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
export interface TicketApi {
  id: string
  event_title: string
  event_status: string
  ticket_status: 'booked' | 'checked_in' | 'canceled'
  checked_in_at: string | null
  price_cents: number
  qr_code: string
  total_count?: string
  event_id: string
}
export type GetOrSearchMyTicketsSchema = {
  limit?: number
  page?: number
  status?: 'booked' | 'checked_in' | 'canceled'
  q?: string
}
export interface GetMyTicketsResponse {
  tickets: TicketApi[]
  limit: number
  page: number
  total_page: number
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
  forgotPassword: (email: string) => {
    return http.post<MessageOnly>('/users/forgot-password', { email })
  },
  verifyEmail: (body: EmailTokenRequest) => {
    return http.post<MessageOnly>('/users/verify-email', body)
  },
  verifyForgotPassword: (body: ForgotPasswordRequest) => {
    return http.post<MessageOnly>('/users/verify-forgot-password', body)
  },
  resetPassword: (body: ResetPasswordPayload) => {
    return http.post<MessageOnly>('/users/reset-password', body)
  },
  searchEventsOrganizer: (status: string, q?: string, limit: number = 20, page: number = 1) => {
    return http.get<SuccessResponse<GetEventsResponse>>('/users/me/events', {
      params: { status, q, limit, page }
    })
  },
  getCreatedEventDetails: (event_id: string) => {
    return http.get<SuccessResponse<Event>>(`/users/me/events/${event_id}`)
  },
  getCreatedEvents: (limit: number = 20, page: number = 1) => {
    return http.get<SuccessResponse<GetEventsResponse>>('/users/me/events', {
      params: { limit, page }
    })
  },
  searchMyTickets: (body: GetOrSearchMyTicketsSchema) => {
    return http.get<SuccessResponse<GetMyTicketsResponse>>('/users/me/tickets', { params: body })
  },
  getMyTickets: (limit: number = 20, page: number = 1) => {
    return http.get<SuccessResponse<GetMyTicketsResponse>>('/users/me/tickets', {
      params: { limit, page }
    })
  }
}

export default usersApi
