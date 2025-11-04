import { CreateEventRequestBody, UpdateEventDetailsBody } from '~/models/requests/events.requests'
import databaseService from './database.services'
import Event from '~/models/schemas/Event.schema'
import { UUIDv4 } from '~/types/common'

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
    await databaseService.events(
      `INSERT INTO events(
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
        ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
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
    const newEvent = await databaseService.events(
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
        FROM
          events
        WHERE id=$1
      `,
      [new_event.id]
    )
    return newEvent.rows[0]
  }

  async getEvents(limit: number, page: number) {
    const [eventsResult, totalEventsResult] = await Promise.all([
      databaseService.events(
        `
        SELECT id, organizer_id, title, description, poster_url, location_text, start_at, end_at, price_cents, checked_in, capacity, status FROM events
        ORDER BY created_at DESC, id DESC 
        LIMIT $1 OFFSET $2
        `,
        [limit, limit * (page - 1)]
      ),
      databaseService.events(`SELECT COUNT(id) FROM events`)
    ])
    const events = eventsResult.rows
    const totalEvents = totalEventsResult.rows[0].count
    return {
      events,
      totalEvents
    }
  }

  async updateEvent(event_id: UUIDv4, body: UpdateEventDetailsBody) {
    const { title, description, poster_url, location_text, start_at, end_at, price_cents, capacity } = body
    await databaseService.events(
      `UPDATE events SET title=$1, description=$2, poster_url=$3, location_text=$4, start_at=$5, end_at=$6, price_cents=$7, capacity=$8 WHERE id=$9`,
      [title, description, poster_url, location_text, start_at, end_at, price_cents, capacity, event_id]
    )
    const eventRow = await databaseService.events(
      `SELECT id, organizer_id, title, description, poster_url, location_text, start_at, end_at, price_cents, checked_in, capacity, status FROM events WHERE id=$1 LIMIT 1`,
      [event_id]
    )
    return eventRow.rows[0]
  }

  async publishEvent(event_id: UUIDv4) {
    await databaseService.events(`UPDATE events SET status='published' WHERE id=$1`, [event_id])
    const eventRow = await databaseService.events(
      `SELECT id, organizer_id, title, description, poster_url, location_text, start_at, end_at, price_cents, checked_in, capacity, status FROM events WHERE id=$1 LIMIT 1`,
      [event_id]
    )
    return eventRow.rows[0]
  }
}

const eventService = new EventService()
export default eventService
