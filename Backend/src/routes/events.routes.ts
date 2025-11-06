import { Router } from 'express'
import {
  cancelEventController,
  createEventController,
  getCreatedEventsController,
  getEventDetailsController,
  getEventsController,
  publishEventController,
  updateEventDetailsController
} from '~/controllers/events.controllers'
import { accessTokenValidator, organizerValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
import {
  cancelEventStatusValidator,
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
 * Description: Get event's created list
 * Path: /
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: { limit: number, page: number }
 */
eventsRouter.get(
  '/',
  accessTokenValidator,
  organizerValidator,
  paginationValidator,
  wrapRequestHandler(getCreatedEventsController)
)

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

/**
 * Description: Cancel event (change event's status to 'canceled')
 * Path: /:event_id/cancel
 * Method: PATCH
 */
eventsRouter.patch(
  '/:event_id/cancel',
  accessTokenValidator,
  organizerValidator,
  eventIdValidator,
  cancelEventStatusValidator,
  wrapRequestHandler(cancelEventController)
)

export default eventsRouter
