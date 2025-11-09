import { Router } from 'express'
import { bookTicketController } from '~/controllers/tickets.controllers'
import { eventIdValidator } from '~/middlewares/events.middlewares'

import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const ticketsRouter = Router()

ticketsRouter.post('/book', accessTokenValidator, eventIdValidator, wrapRequestHandler(bookTicketController))

export default ticketsRouter
