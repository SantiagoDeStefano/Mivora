import { Router } from 'express'
import {
  forgotPasswordController,
  getMeController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resetPasswordController,
  sendEmailController,
  updateAvatarController,
  updateMeController,
  verifyEmailController,
  verifyForgotPasswordController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  sendEmailValidator,
  updateMeValidator,
  uploadImageValidator,
  verifyForgotPasswordTokenValidator
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
 * Body: UpdateMeRequestBody
 */
usersRouter.patch('/me', accessTokenValidator, updateMeValidator, wrapRequestHandler(updateMeController))

/*
 * Description: Upload avatar image file to s3 and return the link
 * Path: /me
 * Method: PUT
 * Headers: { Authorization: Bearer <access_token> }
 */
usersRouter.put('/me/avatar', accessTokenValidator, uploadImageValidator, wrapRequestHandler(updateAvatarController))

/**
 * Description: Send email verification token to current user's email
 * Path: /me/email-verification
 * Method: POST
 * Headers: { Authorization: Bearer <access_token> }
 */
usersRouter.post(
  '/me/email-verification',
  accessTokenValidator,
  sendEmailValidator,
  wrapRequestHandler(sendEmailController)
)

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
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * Description: Verify link(token) in email to reset password
 * Path: /verity-forgot-password
 * Method: POST
 * Body: { forgot_password_token: string }
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordController)
)

/**
 * Description: Reset password after verify forgot password token
 * Path: /reset-password
 * Method: POST
 * Body: { password: string, confirm_password: string, forgot_password_token: string }
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

export default usersRouter
