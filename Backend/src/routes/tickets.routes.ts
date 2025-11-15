import { Router } from 'express'
import { bookTicketController } from '~/controllers/tickets.controllers'
import { eventIdValidator } from '~/middlewares/events.middlewares'
import { bookTicketValidator } from '~/middlewares/tickets.middlewares'
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

ticketsRouter.post(
  '/scan',
  accessTokenValidator,
  organizerValidator,
  eventIdValidator,
  // scanTicketValidator,
  wrapRequestHandler(bookTicketController)
)

export default ticketsRouter
