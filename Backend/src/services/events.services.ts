import { CreateEventRequestBody, UpdateEventDetailsBody } from '~/models/requests/events.requests'
import databaseService from './database.services'
import Event from '~/models/schemas/Event.schema'
import { UUIDv4 } from '~/types/common'
import { EventStatus } from '~/types/domain'

class EventService {
  async createEvent(organizer_id: UUIDv4, body: CreateEventRequestBody) {
    const { title, description, poster_url, location_text, start_at, end_at, price_cents, capacity } = body
    const new_event = new Event({
      organizer_id,
      title,
      description,
      poster_url,
      location_text,
      start_at,
      end_at,
      price_cents,
      capacity
    })
    const newEvent = await databaseService.events(
      `
        INSERT INTO events(
          id, 
          organizer_id, 
          title, 
          description, 
          poster_url, 
          location_text, 
          start_at, 
          end_at, 
          price_cents, 
          checked_in,
          capacity, 
          status
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
        )
        RETURNING
          id,
          organizer_id, 
          title, 
          description, 
          poster_url, 
          location_text, 
          start_at, 
          end_at, 
          price_cents,
          checked_in, 
          capacity, 
          status
      `,
      [
        new_event.id,
        new_event.organizer_id,
        new_event.title,
        new_event.description,
        new_event.poster_url,
        new_event.location_text,
        new_event.start_at,
        new_event.end_at,
        new_event.price_cents,
        new_event.checked_in,
        new_event.capacity,
        new_event.status
      ]
    )
    return newEvent.rows[0]
  }

  async getOrSearchPublishedEvents(search: string, limit: number, page: number, status: EventStatus) {
    const eventsResult = !search
      ? await databaseService.events(
          `
          SELECT id, title, description, poster_url, location_text, start_at, end_at, price_cents, checked_in, capacity, status FROM events WHERE status=$1
          ORDER BY created_at DESC, id DESC 
          LIMIT $2 OFFSET $3
        `,
          [status, limit, limit * (page - 1)]
        )
      : await databaseService.events(
          `
          SELECT
            id,
            organizer_id,
            title,
            description,
            poster_url,
            location_text,
            start_at,
            end_at,
            price_cents,
            checked_in,
            capacity,
            status
          FROM events 
          WHERE title ILIKE '%' || $1 || '%' AND status = $2
          ORDER BY similarity(title, $1) DESC, title
          LIMIT $3 OFFSET $4
        `,
          [search, status, limit, limit * (page - 1)]
        )

    const events = eventsResult.rows
    const totalEvents = eventsResult.rows.length
    return {
      events,
      totalEvents
    }
  }
  async getOrSearchEventsWithStatus(organizer_id: UUIDv4, limit: number, page: number, search?: string, status?: EventStatus) {
    const statusParam = status ?? null // null = "all statuses"
    const searchParam = search ?? null // null = "no search"
    const eventsResult = await databaseService.events(
      `
          SELECT
            id,
            organizer_id,
            title,
            description,
            poster_url,
            location_text,
            start_at,
            end_at,
            price_cents,
            checked_in,
            capacity,
            status
          FROM events
          WHERE organizer_id = $1
            AND status = COALESCE($2::event_status, status)
            AND title ILIKE COALESCE('%' || $3::text || '%', title)
          ORDER BY created_at DESC, id DESC
          LIMIT $4 OFFSET $5
        `,
      [organizer_id, statusParam, searchParam, limit, limit * (page - 1)]
    )

    const events = eventsResult.rows
    const totalEvents = eventsResult.rows.length
    return {
      events,
      totalEvents
    }
  }

  async updateEvent(event_id: UUIDv4, body: UpdateEventDetailsBody) {
    const { title, description, poster_url, location_text, start_at, end_at, price_cents, capacity } = body
    const event = await databaseService.events(
      `
        UPDATE events
        SET
          title = $1,
          description = $2,
          poster_url = $3,
          location_text = $4,
          start_at = $5,
          end_at = $6,
          price_cents = $7,
          capacity = $8
        WHERE id = $9
        RETURNING
          id,
          organizer_id,
          title,
          description,
          poster_url,
          location_text,
          start_at,
          end_at,
          price_cents,
          checked_in,
          capacity,
          status
      `,
      [title, description, poster_url, location_text, start_at, end_at, price_cents, capacity, event_id]
    )
    return event.rows[0]
  }

  async publishEvent(event_id: UUIDv4) {
    const event = await databaseService.events(
      `
        UPDATE events
        SET status = 'published'
        WHERE id = $1
        RETURNING
          id,
          organizer_id,
          title,
          description,
          poster_url,
          location_text,
          start_at,
          end_at,
          price_cents,
          checked_in,
          capacity,
          status
      `,
      [event_id]
    )
    return event.rows[0]
  }

  async cancelEvent(event_id: UUIDv4) {
    const event = await databaseService.events(
      `
        UPDATE events
        SET status = 'canceled'
        WHERE id = $1
        RETURNING
          id,
          organizer_id,
          title,
          description,
          poster_url,
          location_text,
          start_at,
          end_at,
          price_cents,
          checked_in,
          capacity,
          status
      `,
      [event_id]
    )
    return event.rows[0]
  }

  async searchEvents(search: string, limit: number, page: number) {
    const eventsResult = await databaseService.events(
      `
        SELECT id, title
        FROM events
        WHERE title ILIKE '%' || $1 || '%'
        ORDER BY similarity(name, $1) DESC, name
        LIMIT $2 OFFSET $3
      `,
      [search, limit, page]
    )
    const events = eventsResult.rows
    const totalEvents = eventsResult.rows.length
    return {
      events,
      totalEvents
    }
  }
}

const eventService = new EventService()
export default eventService
