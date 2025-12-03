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
  '/organizer/',
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
  '/organizer/:event_id',
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
 * List or search events for the authenticated organizer
 * - Method: GET
 * - Path: /organizer/
 * - Protected: requires `Authorization: Bearer <access_token>` and organizer role
 * - Query: { limit, page, status?, q? }
 * - Validations: `getEventStatusValidator`, `paginationValidator`, `searchValidator`
 * - Success: 200 with paginated list (filtered by status if provided)
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
 * Get details for an event created by the authenticated organizer
 * - Method: GET
 * - Path: /organizer/:event_id
 * - Protected: requires `Authorization: Bearer <access_token>` and organizer role
 * - Params: `event_id` in URL (validated by `eventIdValidator` if applied upstream)
 * - Success: 200 with event details for organizer's event
 */
eventsRouter.get(
  '/organizer/:event_id',
  accessTokenValidator,
  organizerValidator,
  wrapRequestHandler(getCreatedEventDetailsController)
)

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
  '/organizer/:event_id/publish',
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
  '/organizer/:event_id/cancel',
  accessTokenValidator,
  organizerValidator,
  eventIdValidator,
  cancelEventStatusValidator,
  wrapRequestHandler(cancelEventController)
)

export default eventsRouter
