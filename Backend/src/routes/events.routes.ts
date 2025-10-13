import { Router } from 'express'
// import { createEventController } from '~/controllers/events.controllers'
// import { accessTokenValidator, organizerValidator } from '~/middlewares/users.middlewares'
// import { wrapRequestHandler } from '~/utils/handlers'

const eventsRouter = Router()

/**
 * Description: Create a new event
 * Path: /
 * Method: POST
 * Body: { title: string, description?: string, poster_url?: string, localtion_text: , start_at: , end_at: , price_cents: , capacity: number, status: EventStatus }
 */
// eventsRouter.post('/', accessTokenValidator, organizerValidator, wrapRequestHandler(createEventController))

export default eventsRouter
