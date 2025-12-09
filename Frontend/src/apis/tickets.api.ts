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
  qr_code: string | null
  total_count?: string
  event_id: string
}

// Shape cho UI: dùng `status` thay vì `ticket_status`
export interface Ticket extends Omit<TicketApi, 'ticket_status'> {
  status: 'booked' | 'checked_in' | 'canceled'
}

export interface BookTicketResult {
  ticket: TicketApi
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

// Helper: map từ backend shape sang UI shape
export const mapTicketApiToTicket = (raw: TicketApi): Ticket => ({
  ...raw,
  status: raw.ticket_status
})

const ticketsApi = {
  bookTicket: async (event_id: string) => {
    const res = await http.post<SuccessResponse<BookTicketResult>>(
      '/tickets',
      { event_id }
    )
    return res.data
  },

  // lấy danh sách ticket (có thể là default list)
  // getMyTickets: (limit: number = 20, page: number = 1) => {
  //   return http.get<SuccessResponse<GetMyTicketsResponse>>('/tickets', {
  //     params: { limit, page }
  //   })
  // },
  getTicketDetails: (ticket_id: string) => {
    return http.get<SuccessResponse<TicketApi>>(`/tickets/${ticket_id}`)
  },

  // scan QR check-in
  scanTicket: (qr_code_token: string) => {
    return http.post<SuccessResponse<ScanTicketResult>>('/tickets/check-ins', {
      qr_code_token
    })
  },

  // cancel ticket (PATCH status = 'canceled')
  cancelTicket: (ticket_id: string) => {
    return http.patch<SuccessResponse<null>>(`/tickets/${ticket_id}/status`, {
      status: 'canceled'
    })
  }
}

export default ticketsApi
