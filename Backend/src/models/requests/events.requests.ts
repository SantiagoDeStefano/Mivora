import { UUIDv4 } from '~/types/common'
import { EventStatus } from '~/types/domain'
import { Query } from 'express-serve-static-core'

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

// Query
export interface Pagination extends Query {
  limit: string
  page: string
}
