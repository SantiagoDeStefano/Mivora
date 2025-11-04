import { Router } from 'express'
import {
  createEventController,
  getEventDetailsController,
  getEventsController,
  publishEventController,
  updateEventDetailsController
} from '~/controllers/events.controllers'
import { accessTokenValidator, organizerValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
import {
  createEventValidator,
  eventIdValidator,
  paginationValidator,
  publishEventStatusValidator,
  updateEventStatusValidator,
  updateEventValidator
} from '~/middlewares/events.middlewares'

const eventsRouter = Router()

/**
 * Description: Create a new event
 * Path: /
 * Method: POST
 * Body: { title: string, description?: string, poster_url?: string, localtion_text: , start_at: , end_at: , price_cents: , capacity: number, status: EventStatus }
 */
eventsRouter.post(
  '/',
  accessTokenValidator,
  organizerValidator,
  createEventValidator,
  wrapRequestHandler(createEventController)
)

/**
 * Description: Update event's details
 * Path: /:event_id
 * Method: PATCH
 * Query: { title: string, description?: string, poster_url?: string, localtion_text: , start_at: , end_at: , price_cents: , capacity: number, status: EventStatus }
 */
eventsRouter.patch(
  '/:event_id',
  accessTokenValidator,
  organizerValidator,
  eventIdValidator,
  updateEventStatusValidator,
  updateEventValidator,
  wrapRequestHandler(updateEventDetailsController)
)

/**
 * Description: Get event's list
 * Path: /
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: { limit: number, page: number }
 */
eventsRouter.get('/', paginationValidator, wrapRequestHandler(getEventsController))

/**
 * Description: Get event's details
 * Path: /:event_id
 * Method: GET
 */
eventsRouter.get('/:event_id', accessTokenValidator, eventIdValidator, wrapRequestHandler(getEventDetailsController))

/**
 * Description: Publish event (change event's status to 'published')
 * Path: /:event_id/publish
 * Method: PATCH
 */
eventsRouter.patch(
  '/:event_id/publish',
  accessTokenValidator,
  organizerValidator,
  eventIdValidator,
  publishEventStatusValidator,
  wrapRequestHandler(publishEventController)
)

export default eventsRouter
