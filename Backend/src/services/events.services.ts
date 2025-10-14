import { CreateEventRequestBody } from '~/models/requests/events.requests'
import databaseService from './database.services'
import Event from '~/models/schemas/Event.schema'
import { UUIDv4 } from '~/types/common'

class TweetService {
  async createEvent(organizer_id: UUIDv4, body: CreateEventRequestBody) {
    const {
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
    } = body
    const new_event = new Event({
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
}

const tweetService = new TweetService()
export default tweetService
