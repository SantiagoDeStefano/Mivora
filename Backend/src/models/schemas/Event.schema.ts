import { UUIDv4 } from '~/types/common'
import { EventStatus } from '~/types/domain'
import { newUUIDv4 } from '~/utils/uuid'
import pg from 'pg'

export interface EventType extends pg.QueryResultRow {
  id?: UUIDv4
  organizer_id: UUIDv4
  title: string
  description?: string
  poster_url?: string
  location_text: string
  start_at: Date
  end_at: Date
  price_cents: number
  capacity: number
  status?: EventStatus
}

export default class Event {
  id: UUIDv4
  organizer_id: UUIDv4
  title: string
  description: string
  poster_url: string
  location_text: string
  start_at: Date
  end_at: Date
  price_cents: number
  capacity: number
  status: EventStatus

  constructor(event: EventType) {
    this.id = event.id || newUUIDv4()
    this.organizer_id = event.organizer_id
    this.title = event.title
    this.description = event.description || 'Welcome to my party!'
    this.poster_url = event.poster_url || '/default-poster-link-that-i-havent-get'
    this.location_text = event.location_text
    this.start_at = event.start_at
    this.end_at = event.end_at
    this.price_cents = event.price_cents
    this.capacity = event.capacity
    this.status = event.status || 'draft'
  }
}
