import { Router } from 'express'
import {
  bookTicketController,
  getOrSearchTicketWithStatusController,
  scanTicketController
} from '~/controllers/tickets.controllers'
import { eventIdValidator, paginationValidator, searchValidator } from '~/middlewares/events.middlewares'
import {
  bookTicketValidator,
  eventCreatorValidator,
  getTicketStatusValidator,
  scanTicketValidator
} from '~/middlewares/tickets.middlewares'
import { accessTokenValidator, organizerValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const ticketsRouter = Router()

/**
 * Description: Scan attendee's ticket
 * Path: /book
 * Method: PATCH
 * Headers: { Authorization: Bearer <refresh_token> }
 * Body: { event_id: string }
 */
ticketsRouter.post(
  '/book',
  accessTokenValidator,
  eventIdValidator,
  bookTicketValidator,
  wrapRequestHandler(bookTicketController)
)

/**
 * Description: Scan attendee's ticket
 * Path: /scan
 * Method: PATCH
 * Body: { qr_code_token: string }
 */
ticketsRouter.patch(
  '/scan',
  accessTokenValidator,
  organizerValidator,
  scanTicketValidator,
  eventCreatorValidator,
  wrapRequestHandler(scanTicketController)
)

/**
 * Description: Get or search tickets with status
 * Path: /
 * Method: GET
 * Query: { limit: number, page: number, status?: TicketStatus, q?: string }
 */
ticketsRouter.get(
  '/',
  accessTokenValidator,
  getTicketStatusValidator,
  paginationValidator,
  wrapRequestHandler(getOrSearchTicketWithStatusController)
)

export default ticketsRouter
