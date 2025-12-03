import { SuccessResponse } from 'src/types/response.types'
import http from '../utils/http'

export interface Ticket {
  id: string
  title: string
  user_id: string
  price_cents: number
  checked_in_at: number
  total_count: number
  qr_code: string
  status: 'booked' | 'checked_in'
}

export interface GetTicketsResponse {
  events: Event[]
  limit: number
  page: number
  total_page: number
}

const ticketsApi = {
  bookTicket: (event_id: string) => {
    return http.post<SuccessResponse<Ticket>>('/tickets/book', event_id)
  },
}

export default ticketsApi

