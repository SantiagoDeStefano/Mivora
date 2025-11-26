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

  async getPublishedEvents(limit: number, page: number, status: EventStatus) {
    const eventsResult = await databaseService.events(
      `
        SELECT id, organizer_id, title, description, poster_url, location_text, start_at, end_at, price_cents, checked_in, capacity, status FROM events WHERE status=$1
        ORDER BY created_at DESC, id DESC 
        LIMIT $2 OFFSET $3
        `,
      [status, limit, limit * (page - 1)]
    )
    const events = eventsResult.rows
    const totalEvents = eventsResult.rows.length
    return {
      events,
      totalEvents
    }
  }
  async getEventsWithStatus(organizer_id: UUIDv4, status: EventStatus, limit: number, page: number) {
    const eventsResult = !status
      ? await databaseService.events(
          `
            SELECT id, organizer_id, title, description, poster_url, location_text,
                start_at, end_at, price_cents, checked_in, capacity, status
            FROM events WHERE organizer_id=$1
            ORDER BY created_at DESC, id DESC 
            LIMIT $2 OFFSET $3
          `,
          [organizer_id, limit, limit * (page - 1)]
        )
      : await databaseService.events(
          `
            SELECT id, organizer_id, title, description, poster_url, location_text,
                start_at, end_at, price_cents, checked_in, capacity, status
            FROM events WHERE organizer_id=$1 AND status = $2
            ORDER BY created_at DESC, id DESC 
            LIMIT $3 OFFSET $4
          `,
          [organizer_id, status, limit, limit * (page - 1)]
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
}

const eventService = new EventService()
export default eventService
