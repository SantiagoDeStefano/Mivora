import { Router } from 'express'
import {
  cancelEventController,
  createEventController,
  getCreatedEventDetailsController,
  getEventDetailsController,
  getOrSearchEventsController,
  getOrSearchEventsWithStatusController,
  publishEventController,
  updateEventDetailsController
} from '~/controllers/events.controllers'
import { accessTokenValidator, organizerValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
import {
  cancelEventStatusValidator,
  createEventValidator,
  eventIdValidator,
  getEventStatusValidator,
  getPublishedEventStatusValidator,
  paginationValidator,
  publishEventStatusValidator,
  searchValidator,
  updateEventStatusValidator,
  updateEventValidator
} from '~/middlewares/events.middlewares'

const eventsRouter = Router()

/**
 * Description: Create a new event
 * Path: /organizer/
 * Method: POST
 * Body: { title: string, description?: string, poster_url?: string, localtion_text: , start_at: , end_at: , price_cents: , capacity: number, status: EventStatus }
 */
eventsRouter.post(
  '/organizer/',
  accessTokenValidator,
  organizerValidator,
  createEventValidator,
  wrapRequestHandler(createEventController)
)

/**
 * Description: Update event's details
 * Path: /organizer/:event_id
 * Method: PATCH
 * Body: { title: string, description?: string, poster_url?: string, localtion_text: , start_at: , end_at: , price_cents: , capacity: number, status: EventStatus }
 */
eventsRouter.patch(
  '/organizer/:event_id',
  accessTokenValidator,
  organizerValidator,
  eventIdValidator,
  updateEventStatusValidator,
  updateEventValidator,
  wrapRequestHandler(updateEventDetailsController)
)

/**
 * Description: Get or search all published event
 * Path: /
 * Method: GET
 * Query: { limit: number, page: number, q?: string }
 */
eventsRouter.get('/', paginationValidator, searchValidator, wrapRequestHandler(getOrSearchEventsController))

/**
 * Description: Get or search event
 * Path: /
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: { limit: number, page: number, status?: string, q?: string }
 */
eventsRouter.get(
  '/organizer/',
  accessTokenValidator,
  organizerValidator,
  getEventStatusValidator,
  paginationValidator,
  searchValidator,
  wrapRequestHandler(getOrSearchEventsWithStatusController)
)

/**
 * Description: Get created event's details
 * Path: /organizer/:event_id
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
eventsRouter.get(
  '/organizer/:event_id',
  accessTokenValidator,
  organizerValidator,
  wrapRequestHandler(getCreatedEventDetailsController)
)

/**
 * Description: Get published event's details
 * Path: /:event_id
 * Method: GET
 */
eventsRouter.get(
  '/:event_id',
  eventIdValidator,
  getPublishedEventStatusValidator,
  wrapRequestHandler(getEventDetailsController)
)

/**
 * Description: Publish event (change event's status to 'published')
 * Path: /:event_id/publish
 * Method: PATCH
 */
eventsRouter.patch(
  '/organizer/:event_id/publish',
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
  '/organizer/:event_id/cancel',
  accessTokenValidator,
  organizerValidator,
  eventIdValidator,
  cancelEventStatusValidator,
  wrapRequestHandler(cancelEventController)
)

export default eventsRouter
