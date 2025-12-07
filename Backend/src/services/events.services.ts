import { CreateEventRequestBody, UpdateEventDetailsBody } from '~/models/requests/events.requests'
import databaseService from './database.services'
import Event from '~/models/schemas/Event.schema'
import { UUIDv4 } from '~/types/common'
import { EventStatus } from '~/types/domain'

class EventService {
  /**
   * Create a new event owned by the organizer
   * - Inputs: `organizer_id`, `body: CreateEventRequestBody`
   * - Action: inserts a new `events` row and returns the created event record
   * - Returns: created event object (id, title, description, poster_url, location_text, start_at, end_at, price_cents, checked_in, capacity, status)
   */
  async createEvent(organizer_id: UUIDv4, body: CreateEventRequestBody) {
    const { title, description, location_text, start_at, end_at, price_cents, capacity } = body
    const new_event = new Event({
      organizer_id,
      title,
      description,
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

  /**
   * List or search published events (public)
   * - Inputs: `search` (optional), `limit`, `page`, `status` (usually 'published')
   * - Action: queries `events` joined with organizer name, applies pagination and optional search
   * - Returns: { events: Event[], totalEvents: number }
   */
  async getOrSearchPublishedEvents(search: string, limit: number, page: number, status: EventStatus) {
    const eventsResult = !search
      ? await databaseService.events(
          `
          SELECT 
            events.id,
            users.name as organizer_name,
            events.title,
            events.description,
            events.poster_url,
            events.location_text,
            events.start_at,
            events.end_at,
            events.price_cents,
            events.checked_in,
            events.capacity,
            events.status,
            COUNT(*) OVER() AS total_count
          FROM events 
          JOIN users ON events.organizer_id = users.id
          WHERE status=$1
          ORDER BY events.created_at DESC, events.id DESC 
          LIMIT $2 OFFSET $3
        `,
          [status, limit, limit * (page - 1)]
        )
      : await databaseService.events(
          `
          SELECT
            events.id,
            users.name as organizer_name,
            events.title,
            events.description,
            events.poster_url,
            events.location_text,
            events.start_at,
            events.end_at,
            events.price_cents,
            events.checked_in,
            events.capacity,
            events.status,
            COUNT(*) OVER() AS total_count
          FROM events 
          JOIN users ON events.organizer_id = users.id
          WHERE events.title ILIKE '%' || $1 || '%' AND events.status = $2
          ORDER BY similarity(events.title, $1) DESC, events.title
          LIMIT $3 OFFSET $4
        `,
          [search, status, limit, limit * (page - 1)]
        )

    const events = eventsResult.rows
    const totalEvents = events.length > 0 ? Number(events[0].total_count) : 0
    return {
      events,
      totalEvents
    }
  }
  /**
   * List or search events for a specific organizer, optionally filtered by status
   * - Inputs: `organizer_id`, `limit`, `page`, optional `search`, optional `status`
   * - Action: returns organizer's events with pagination and optional filters
   * - Returns: { events: Event[], totalEvents: number }
   */
  async getOrSearchEventsWithStatus(
    organizer_id: UUIDv4,
    limit: number,
    page: number,
    search?: string,
    status?: EventStatus
  ) {
    const statusParam = status ?? null // null = "all statuses"
    const searchParam = search ?? null // null = "no search"
    const eventsResult = await databaseService.events(
      `
        SELECT
          events.id,
          events.title,
          events.description,
          events.poster_url,
          events.location_text,
          events.start_at,
          events.end_at,
          events.price_cents,
          events.checked_in,
          events.capacity,
          events.status,
          COUNT(*) OVER() AS total_count,
          COALESCE(revenue.revenue_cents, 0) AS revenue_cents
        FROM events
        LEFT JOIN (
          SELECT
            event_id,
            SUM(price_cents) AS revenue_cents
          FROM tickets
          WHERE status = 'checked_in'
          GROUP BY event_id
        ) revenue ON revenue.event_id = events.id
        WHERE organizer_id = $1
          AND status = COALESCE($2::event_status, status)
          AND title ILIKE COALESCE('%' || $3::text || '%', title)
        ORDER BY created_at DESC, id DESC
        LIMIT $4 OFFSET $5;
      `,
      [organizer_id, statusParam, searchParam, limit, limit * (page - 1)]
    )

    const events = eventsResult.rows
    const totalEvents = events.length > 0 ? Number(events[0].total_count) : 0
    return {
      events,
      totalEvents
    }
  }
  /**
   * Return details for a specific event created by the organizer
   * - Inputs: `organizer_id`, `event_id`
   * - Action: verifies ownership and returns the event details (or undefined if not found)
   * - Returns: event object or undefined
   */
  async getCreatedEventDetails(organizer_id: UUIDv4, event_id: UUIDv4) {
    const eventsResult = await databaseService.events(
      `
        SELECT
          events.id,
          events.title,
          events.description,
          events.poster_url,
          events.location_text,
          events.start_at,
          events.end_at,
          events.price_cents,
          events.checked_in,
          events.capacity,
          events.status,
          COALESCE(revenue.revenue_cents, 0) AS revenue_cents
        FROM events
        LEFT JOIN (
          SELECT
            event_id,
            SUM(price_cents) AS revenue_cents
          FROM tickets
          WHERE status = 'checked_in'
          GROUP BY event_id
        ) revenue ON revenue.event_id = events.id
        WHERE organizer_id = $1
          AND events.id = $2
        LIMIT 1;
      `,
      [organizer_id, event_id]
    )

    return eventsResult.rows[0]
  }
  /**
   * Update an event's mutable fields
   * - Inputs: `event_id`, `body: UpdateEventDetailsBody`
   * - Action: updates the events row and returns the updated record
   * - Returns: updated event object
   */
  async updateEvent(event_id: UUIDv4, body: UpdateEventDetailsBody) {
    const { title, description, location_text, start_at, end_at, price_cents, capacity } = body
    const event = await databaseService.events(
      `
        UPDATE events
        SET
          title = $1,
          description = $2,
          location_text = $3,
          start_at = $4,
          end_at = $5,
          price_cents = $6,
          capacity = $7
        WHERE id = $8
        RETURNING
          id,
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
      [title, description, location_text, start_at, end_at, price_cents, capacity, event_id]
    )
    return event.rows[0]
  }

  /**
   * Change an event's status
   * - Inputs: `event_id`, `status`
   * - Action: updates the event's status and returns the updated record
   * - Returns: updated event object
   */
  async changeEventStatus(event_id: UUIDv4, status: EventStatus) {
    const event = await databaseService.events(
      `
        UPDATE events
        SET status = $1
        WHERE id = $2
        RETURNING
          id,
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
      [status, event_id]
    )
    return event.rows[0]
  }

  /**
   * Mark an event as published
   * - Input: `event_id`
   * - Action: sets `status = 'published'` and returns the updated event
   * - Returns: updated event object
   */
  async publishEvent(event_id: UUIDv4) {
    const event = await databaseService.events(
      `
        UPDATE events
        SET status = 'published'
        WHERE id = $1
        RETURNING
          id,
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

  /**
   * Mark an event as canceled
   * - Input: `event_id`
   * - Action: sets `status = 'canceled'` and returns the updated event
   * - Returns: updated event object
   */
  async cancelEvent(event_id: UUIDv4) {
    const event = await databaseService.events(
      `
        UPDATE events
        SET status = 'canceled'
        WHERE id = $1
        RETURNING
          id,
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

  /**
   * Lightweight title search used for quick lookups
   * - Inputs: `search`, `limit`, `page`
   * - Action: finds event IDs and titles matching the search term
   * - Returns: { events: Array<{id, title}>, totalEvents: number }
   */
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

  async uploadEventPoster(event_id: UUIDv4, poster_url: string) {
    const event = await databaseService.events(
      `
        UPDATE events
        SET poster_url = $1
        WHERE id = $2
        RETURNING
          id,
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
      [poster_url, event_id]
    )
    return event.rows[0]
  }
}

const eventService = new EventService()
export default eventService
