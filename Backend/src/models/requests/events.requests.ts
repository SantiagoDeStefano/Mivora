import { UUIDv4 } from '~/types/common'
import { EventStatus } from '~/types/domain'

// Body
export interface CreateEventRequestBody {
  id?: UUIDv4
  title: string
  description?: string
  poster_url?: string
  location_text: string
  start_at: Date
  end_at: Date
  price_cents: number
  checked_in?: number
  capacity: number
  status?: EventStatus
}
