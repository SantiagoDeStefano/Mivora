import { EventStatus } from '~/types/domain'
import { Query } from 'express-serve-static-core'

// Body
export interface CreateEventRequestBody {
  title: string
  description?: string
  poster_url?: string
  location_text: string
  start_at: Date
  end_at: Date
  price_cents: number
  capacity: number
}

export interface UpdateEventDetailsBody {
  title?: string
  description?: string
  poster_url?: string
  location_text?: string
  start_at?: Date
  end_at?: Date
  price_cents?: number
  capacity?: number
}

// Query
export interface Pagination extends Query {
  limit: string
  page: string
}

export interface SearchEventWithStatus extends Pagination {
  status?: EventStatus
  q?: string
}

export interface GetCreatedEventDetailsParams {
  event_id?: string
}

export interface SearchEvents extends Pagination {
  q: string
}
