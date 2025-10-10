import { Router } from 'express'
import { loginController, logoutController, registerController } from '~/controllers/users.controllers'
import { accessTokenValidator, loginValidator, refreshTokenValidator, registerValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()

/**
 * Description: Register a new user
 * Path: /register
 * Method: POST
 * Body: { name: string, email: string, password: string, confirm_password:string, role: 'Attendee' || 'Organizer', avatar_url: string }
 */
usersRouter.post('/register', registerValidator ,wrapRequestHandler(registerController))

/**
 * Description: Register a new user
 * Path: /login
 * Method: POST
 * Body: { email: string, password: string }
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * Description: Register a new user
 * Path: /logout
 * Method: POST
 * Headers: { Authorization: Bearer <refresh_token> }
 * Body: { refresh_token: string }
 */
usersRouter.post(
  '/logout', 
  accessTokenValidator, 
  refreshTokenValidator, 
  wrapRequestHandler(logoutController)
) 


export default usersRouter
