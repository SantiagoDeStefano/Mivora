import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { EVENTS_MESSAGES } from '~/constants/messages'
import {
  CreateEventRequestBody,
  GetCreatedEventDetailsParams,
  SearchEvents,
  SearchEventWithStatus,
  UpdateEventDetailsBody
} from '~/models/requests/events.requests'
import { TokenPayload } from '~/models/requests/users.requests'
import Event from '~/models/schemas/Event.schema'

import eventService from '~/services/events.services'
import mediasService from '~/services/medias.services'
import { UUIDv4 } from '~/types/common'
import { EventStatus } from '~/types/domain'

/**
 * Create event controller
 * - Route: POST /organizer/
 * - Protected: requires organizer Authorization header
 * - Body: `CreateEventRequestBody` (title, description?, poster_url?, location_text, start_at, end_at, price_cents, capacity, status)
 * - Action: creates an event owned by the authenticated organizer
 * - Response: JSON { message, result } with created event
 */
export const createEventController = async (
  req: Request<ParamsDictionary, unknown, CreateEventRequestBody>,
  res: Response
): Promise<void> => {
  const organizer_id = (req.decoded_authorization as TokenPayload).user_id
  const result = await eventService.createEvent(organizer_id, req.body)
  res.json({
    message: EVENTS_MESSAGES.EVENT_CREATED_SUCCESSFULLY,
    result
  })
}

/**
 * List or search published events (public)
 * - Route: GET /
 * - Query: `{ limit, page, q? }`
 * - Action: returns paginated list of published events
 * - Response: JSON { message, result: { events, limit, page, total_page } }
 */
export const getOrSearchEventsController = async (
  req: Request<ParamsDictionary, unknown, unknown, SearchEvents>,
  res: Response
): Promise<void> => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const search = req.query.q
  // Easier postman uses, change to published on production
  const eventStatus = 'published' as EventStatus
  const result = await eventService.getOrSearchPublishedEvents(search, limit, page, eventStatus)
  res.json({
    message: EVENTS_MESSAGES.GET_EVENTS_SUCCESSFULLY,
    result: {
      events: result.events,
      limit,
      page,
      total_page: Math.ceil(result.totalEvents / limit)
    }
  })
}

/**
 * List or search events for authenticated organizer
 * - Route: GET /organizer/
 * - Protected: requires organizer Authorization header
 * - Query: `{ limit, page, status?, q? }`
 * - Action: returns paginated list filtered by status/search for the organizer
 */
export const getOrSearchEventsWithStatusController = async (
  req: Request<ParamsDictionary, unknown, unknown, SearchEventWithStatus>,
  res: Response
): Promise<void> => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const status = req.query.status
  const search = req.query.q
  const organizer_id = req.decoded_authorization?.user_id as UUIDv4
  const result = await eventService.getOrSearchEventsWithStatus(organizer_id, limit, page, search, status)
  res.json({
    message: EVENTS_MESSAGES.GET_EVENTS_SUCCESSFULLY,
    result: {
      events: result.events,
      limit,
      page,
      total_page: Math.ceil(result.totalEvents / limit)
    }
  })
}

/**
 * Get event details for organizer-created event
 * - Route: GET /organizer/:event_id
 * - Protected: requires organizer Authorization header
 * - Params: `event_id` (UUID)
 * - Action: returns full event details for the organizer's event
 */
export const getCreatedEventDetailsController = async (
  req: Request<ParamsDictionary, unknown, unknown, GetCreatedEventDetailsParams>,
  res: Response
): Promise<void> => {
  const event_id = req.params.event_id as UUIDv4
  const organizer_id = req.decoded_authorization?.user_id as UUIDv4
  const result = await eventService.getCreatedEventDetails(organizer_id, event_id)
  res.json({
    message: EVENTS_MESSAGES.GET_CREATED_EVENTS_DETAILS_SUCCESSFULLY,
    result
  })
}

/**
 * Get public event details
 * - Route: GET /:event_id
 * - Params: `event_id` (UUID)
 * - Action: returns public event information (only for published events)
 */
export const getEventDetailsController = async (req: Request, res: Response): Promise<void> => {
  const eventData = req.event?.[0]
  const event = {
    ...eventData
  }
  res.json({
    message: EVENTS_MESSAGES.GET_EVENTS_SUCCESSFULLY,
    result: event
  })
}

/**
 * Update event details controller
 * - Route: PATCH /organizer/:event_id
 * - Protected: requires organizer Authorization header
 * - Params: `event_id` (UUID)
 * - Body: partial event fields to update
 * - Action: updates event and returns updated resource
 */
export const updateEventDetailsController = async (
  req: Request<ParamsDictionary, unknown, UpdateEventDetailsBody>,
  res: Response
): Promise<void> => {
  const event_id = (req.event as Event[])[0].id
  const result = await eventService.updateEvent(event_id, req.body)
  res.json({
    message: EVENTS_MESSAGES.UPDATE_EVENT_SUCCESS,
    result
  })
}

/**
 * Upload event poster controller
 * - Route: POST /organizer/:event_id/poster
 * - Protected: requires organizer Authorization header
 * - Params: `event_id` (UUID)
 * - Payload: multipart/form-data with a single `image` file field
 * - Action: uploads event poster and returns uploaded poster event
 */
export const uploadEventPosterController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const event_id = (req.event as Event[])[0].id
  const poster_url = await mediasService.uploadImage(req)
  const result = await eventService.uploadEventPoster(event_id, poster_url[0].url)
  res.json({
    message: EVENTS_MESSAGES.UPLOAD_EVENT_POSTER_SUCCESS,
    result
  })
}

/**
 * Publish event controller
 * - Route: PATCH /organizer/:event_id/publish
 * - Protected: requires organizer Authorization header
 * - Action: marks event as published and returns updated event
 */
export const changeEventStatusController = async (req: Request, res: Response): Promise<void> => {
  const event_id = (req.event as Event[])[0].id
  const status = req.body.status as EventStatus
  const result = await eventService.changeEventStatus(event_id, status)
  res.json({
    message: EVENTS_MESSAGES.CHANGE_EVENT_STATUS_SUCCESS,
    result
  })
}