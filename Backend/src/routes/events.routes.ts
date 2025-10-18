import { Router } from 'express'
import { createEventController, getEventsInfiniteScrollController } from '~/controllers/events.controllers'
import { accessTokenValidator, organizerValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
import { createEventValidator, paginationValidator } from '~/middlewares/events.middlewares'

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
 * Description: Get event's list
 * Path: /  
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: { limit: number, page: number }
 */
eventsRouter.get(
  '/',
  paginationValidator,
  wrapRequestHandler(getEventsInfiniteScrollController)
)

export default eventsRouter
