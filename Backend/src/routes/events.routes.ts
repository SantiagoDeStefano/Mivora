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
 * Create a new event (organizer only)
 * - Method: POST
 * - Path: /organizer/
 * - Protected: requires `Authorization: Bearer <access_token>` and organizer role
 * - Body: { title, description?, poster_url?, location_text, start_at, end_at, price_cents, capacity, status }
 * - Validations: `createEventValidator` enforces required fields and constraints
 * - Success: 201/200 with created event data
 */
eventsRouter.post(
  '/',
  accessTokenValidator,
  organizerValidator,
  createEventValidator,
  wrapRequestHandler(createEventController)
)

/**
 * Update an existing event's details (organizer only)
 * - Method: PATCH
 * - Path: /organizer/:event_id
 * - Protected: requires `Authorization: Bearer <access_token>` and organizer role
 * - Params: `event_id` in URL (validated by `eventIdValidator`)
 * - Body: any updatable fields (title, description, poster_url, location_text, start_at, end_at, price_cents, capacity, status)
 * - Validations: `updateEventStatusValidator`, `updateEventValidator`
 * - Success: 200 with updated event data
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
 * List or search published events
 * - Method: GET
 * - Path: /
 * - Query: { limit, page, q? }
 * - Validations: `paginationValidator`, `searchValidator`
 * - Success: 200 with paginated list of published events
 */
eventsRouter.get('/', paginationValidator, searchValidator, wrapRequestHandler(getOrSearchEventsController))


/**
 * Get details for a published event
 * - Method: GET
 * - Path: /:event_id
 * - Params: `event_id` in URL (validated by `eventIdValidator`)
 * - Validations: `getPublishedEventStatusValidator`
 * - Success: 200 with public event details
 */
eventsRouter.get(
  '/:event_id',
  eventIdValidator,
  getPublishedEventStatusValidator,
  wrapRequestHandler(getEventDetailsController)
)

/**
 * Publish an event (mark status as 'published')
 * - Method: PATCH
 * - Path: /organizer/:event_id/publish
 * - Protected: requires `Authorization: Bearer <access_token>` and organizer role
 * - Params: `event_id` in URL
 * - Validations: `publishEventStatusValidator`
 * - Success: 200 with updated event status
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
 * Cancel an event (mark status as 'canceled')
 * - Method: PATCH
 * - Path: /organizer/:event_id/cancel
 * - Protected: requires `Authorization: Bearer <access_token>` and organizer role
 * - Params: `event_id` in URL
 * - Validations: `cancelEventStatusValidator`
 * - Success: 200 with updated event status
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
