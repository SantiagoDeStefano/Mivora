import { Router } from 'express'
import { bookTicketController, scanTicketController } from '~/controllers/tickets.controllers'
import { eventIdValidator } from '~/middlewares/events.middlewares'
import { bookTicketValidator, eventCreatorValidator, scanTicketValidator } from '~/middlewares/tickets.middlewares'
import { accessTokenValidator, organizerValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const ticketsRouter = Router()

ticketsRouter.post(
  '/book',
  accessTokenValidator,
  eventIdValidator,
  bookTicketValidator,
  wrapRequestHandler(bookTicketController)
)

ticketsRouter.patch(
  '/scan',
  accessTokenValidator,
  organizerValidator,
  scanTicketValidator,
  eventCreatorValidator,
  wrapRequestHandler(scanTicketController)
)

export default ticketsRouter
