import { UUIDv4 } from '~/types/common'
import { Pagination } from './events.requests'
import { TicketStatus } from '~/types/domain'

// Body
export interface BookTicketRequestBody {
  event_id: UUIDv4
}

export interface ScanTicketRequestBody {
  ticket: UUIDv4
}

export interface TicketWithStatus extends Pagination {
  status: TicketStatus
}
