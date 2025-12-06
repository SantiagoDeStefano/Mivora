import { UUIDv4 } from '~/types/common'
import { Pagination } from './events.requests'
import { TicketStatus } from '~/types/domain'
import Ticket from '../schemas/Tickets.schema'

// Body
export interface BookTicketRequestBody {
  event_id: UUIDv4
}

export interface ScanTicketRequestBody {
  ticket: Ticket[]
}

export interface SearchTicketWithStatus extends Pagination {
  status?: TicketStatus
  q?: string
}

// Params
export interface CancelTicketParams {
  ticket_id: UUIDv4
}