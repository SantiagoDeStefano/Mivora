import { Router } from 'express'
import { registerController } from '~/controllers/users.controllers'
import { registerValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()

/**
 * Description: Register a new user
 * Path: /register
 * Method: POST
 * Body: { name: string, email: string, password: string, confirm_password:string, role: 'Attendee' || 'Organizer', avatar_url: string }
 */
usersRouter.post('/register', registerValidator ,wrapRequestHandler(registerController))

export default usersRouter
