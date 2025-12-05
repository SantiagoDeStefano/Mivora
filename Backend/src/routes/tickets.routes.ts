import { Router } from 'express'
import {
  bookTicketController,
  getOrSearchTicketWithStatusController,
  getTicketDetailsController,
  scanTicketController
} from '~/controllers/tickets.controllers'
import { eventIdValidator, paginationValidator, searchValidator } from '~/middlewares/events.middlewares'
import {
  bookTicketValidator,
  eventCreatorValidator,
  getTicketStatusValidator,
  scanTicketValidator,
  ticketIdValidator
} from '~/middlewares/tickets.middlewares'
import { accessTokenValidator, organizerValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const ticketsRouter = Router()

/**
 * Book a ticket for an event
 * - Method: POST
 * - Path: /book
 * - Protected: requires `Authorization: Bearer <access_token>`
 * - Body: `{ event_id: string }`
 * - Validations: `eventIdValidator` ensures the event exists; `bookTicketValidator` validates booking constraints
 * - Action: creates a ticket reservation for the authenticated user
 * - Success: 200/201 with created ticket details
 */
ticketsRouter.post(
  '/',
  accessTokenValidator,
  eventIdValidator,
  bookTicketValidator,
  wrapRequestHandler(bookTicketController)
)

/**
 * Scan an attendee's ticket QR code
 * - Method: POST
 * - Path: /scan
 * - Protected: requires `Authorization: Bearer <access_token>` and organizer role
 * - Body: `{ qr_code_token: string }`
 * - Validations: `scanTicketValidator` checks QR payload; `eventCreatorValidator` ensures the scanner is the event creator
 * - Action: marks ticket as checked-in when valid
 * - Success: 200 with scanned ticket info
 */
ticketsRouter.post(
  '/scan',
  accessTokenValidator,
  organizerValidator,
  scanTicketValidator,
  eventCreatorValidator,
  wrapRequestHandler(scanTicketController)
)

/**
 * List or search tickets for the authenticated user
 * - Method: GET
 * - Path: /
 * - Protected: requires `Authorization: Bearer <access_token>`
 * - Query: `{ limit, page, status?, q? }`
 * - Validations: `getTicketStatusValidator`, `paginationValidator`
 * - Action: returns paginated tickets (filtered by status/search)
 * - Success: 200 with `{ tickets, limit, page, total_page }`
 */
ticketsRouter.get(
  '/',
  accessTokenValidator,
  getTicketStatusValidator,
  paginationValidator,
  wrapRequestHandler(getOrSearchTicketWithStatusController)
)

/**
 * Get ticket details
 * - Method: GET
 * - Path: /:ticket_id
 * - Protected: requires `Authorization: Bearer <access_token>`
 * - Params: `ticket_id` (validated by `ticketIdValidator`)
 * - Action: returns detailed ticket information if the requester is authorized
 * - Success: 200 with ticket details
 */
ticketsRouter.get(
  '/:ticket_id',
  accessTokenValidator,
  ticketIdValidator,
  wrapRequestHandler(getTicketDetailsController)
)

export default ticketsRouter
