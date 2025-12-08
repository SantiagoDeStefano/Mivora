import { SuccessResponse } from '../types/response.types'
import http from '../utils/http'

// Shape đúng với JSON backend
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

export interface Ticket extends Omit<TicketApi, 'ticket_status'> {
  status: 'booked' | 'checked_in' | 'canceled'
}

export interface BookTicketResult {
  ticket: Ticket
}

export interface GetMyTicketsResponse {
  tickets: TicketApi[]
  limit: number
  page: number
  total_page: number
}

export type GetOrSearchMyTicketsSchema = {
  limit?: number
  page?: number
  status?: 'booked' | 'checked_in' | 'canceled'
  q?: string
}

export interface ScanTicketResult {
  ticket: TicketApi
}

const ticketsApi = {
  bookTicket: (event_id: string) => {
    return http.post<SuccessResponse<BookTicketResult>>('/tickets', { event_id })
  },
  getMyTickets: (limit: number = 20, page: number = 1) => {
    return http.get<SuccessResponse<GetMyTicketsResponse>>('/tickets', { params: { limit, page } })
  },
  getTicketDetails: (ticket_id: string) => {
    return http.get<SuccessResponse<TicketApi>>(`/tickets/${ticket_id}`)
  },
  scanTicket: (qr_code_token: string) => {
    return http.post<SuccessResponse<ScanTicketResult>>('/tickets/check-ins', { qr_code_token })
  },
  cancelTicket: (ticket_id: string) => {
    return http.patch<SuccessResponse<null>>(`/tickets/${ticket_id}/status`, { status: 'canceled' })
  }
}

export default ticketsApi
