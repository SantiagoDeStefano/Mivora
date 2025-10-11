import { UUIDv4 } from '~/types/common'
import { EventStatus } from '~/types/domain'
import pg from 'pg'

export interface EventType extends pg.QueryResultRow {
  id?: UUIDv4
  organizer_id: UUIDv4
  title: string,
  description?: string,
  poster_url?: string, 
  location_text: string,
  start_at: Date,
  end_at: Date,
  price_cents: number,
  capacity: number,
  status: EventStatus,
}
