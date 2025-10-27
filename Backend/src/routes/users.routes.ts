import { Router } from 'express'
import {
  forgotPasswordController,
  getMeController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  sendEmailController,
  updateMeController,
  verifyEmailController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  sendEmailValidator,
  updateMeValidator
} from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()

/**
 * Description: Register a new user
 * Path: /register
 * Method: POST
 * Body: { name: string, email: string, password: string, confirm_password:string, role: 'Attendee' || 'Organizer', avatar_url: string }
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * Description: Login to an exsisting user
 * Path: /login
 * Method: POST
 * Body: { email: string, password: string }
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * Description: Remove refreshtoken of a user
 * Path: /logout
 * Method: POST
 * Headers: { Authorization: Bearer <refresh_token> }
 * Body: { refresh_token: string }
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * Description: Get refresh token
 * Path: /refresh-token
 * Method: POST
 * Body: { refresh_token: string }
 */
usersRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

/**
 * Description: Get me
 * Path: /me
 * Method: POST
 */
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

/*
 * Description: Update my profile
 * Path: /me
 * Method: PATCH
 * Headers: { Authorization: Bearer <access_token> }
 */
usersRouter.patch('/me', accessTokenValidator, updateMeValidator, wrapRequestHandler(updateMeController))

/**
 * Description: Send email verification token to current user's email
 * Path: /me/email-verification
 * Method: POST
 * Headers: { Authorization: Bearer <access_token> }
 */
usersRouter.post('/me/email-verification', accessTokenValidator, sendEmailValidator, wrapRequestHandler(sendEmailController))

/**
 * Description: Verify email when user click on the link in the email
 * Path: /verify-email
 * Method: POST
 * Headers: Don't need because user can verify email without login
 * Body: { email_verify_token: string }
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))

/**
 * Description: Submit email to reset password, then send email to user
 * Path: /forgot-password
 * Method: POST
 * Body: { email: string }
 */
  usersRouter.post(
    '/forgot-password', 
    forgotPasswordValidator,
    wrapRequestHandler(forgotPasswordController)
  ) 

export default usersRouter
