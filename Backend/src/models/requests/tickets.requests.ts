import { UUIDv4 } from '~/types/common'

// Body
export interface BookTicketRequestBody {
  event_id: UUIDv4
}

export interface ScanTicketRequestBody {
  ticket: UUIDv4
}
