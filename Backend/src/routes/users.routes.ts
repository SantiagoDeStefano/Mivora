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
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()

/**
 * Register a new user
 * - Method: POST
 * - Path: /register
 * - Public: no authentication required
 * - Body (JSON): { name, email, password, confirm_password, role?, avatar_url? }
 * - Validations: `registerValidator` ensures required fields, email uniqueness and password rules
 * - Success: 201 (created) with created user (or auth tokens depending on controller)
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * Login (authenticate) a user
 * - Method: POST
 * - Path: /login
 * - Public endpoint
 * - Body (JSON): { email, password }
 * - Validations: `loginValidator` checks credentials and attaches user id to request
 * - Success: 200 with `access_token` and `refresh_token` in response
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * Logout and revoke refresh token
 * - Method: POST
 * - Path: /logout
 * - Protected: requires `Authorization: Bearer <access_token>`
 * - Body (JSON): { refresh_token }
 * - Validations: `accessTokenValidator` (auth) and `refreshTokenValidator` (refresh token ownership)
 * - Success: 200 and refresh token removed from persistence
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * Exchange refresh token for new access/refresh tokens
 * - Method: POST
 * - Path: /refresh-token
 * - Public: accepts a `refresh_token` in body
 * - Validations: `refreshTokenValidator` verifies JWT and persistence
 * - Success: 200 with new `{ access_token, refresh_token }`
 */
usersRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

/**
 * Get current user's profile
 * - Method: GET
 * - Path: /me
 * - Protected: requires Authorization header
 * - Returns the authenticated user's profile (name, email, avatar_url, roles, etc.)
 */
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

/**
 * Update current user's profile
 * - Method: PATCH
 * - Path: /me
 * - Protected: requires Authorization header
 * - Body: partial profile fields { name, avatar_url, role }
 * - Validations: `updateMeValidator` (name rules, optional role upgrade to organizer)
 * - Success: 200 with updated user
 */
usersRouter.patch('/me', accessTokenValidator, updateMeValidator, wrapRequestHandler(updateMeController))

/**
 * Upload avatar image for current user
 * - Method: PUT
 * - Path: /me/avatar
 * - Protected: requires Authorization header
 * - Payload: multipart/form-data with a single `image` file field
 * - Middleware: `uploadImageMiddleware` (parses multipart) and `uploadImageValidator` (validates file)
 * - Action: uploads file to S3 via `medias.services` and updates user's `avatar_url`
 * - Success: 200 with avatar URL
 */
usersRouter.put('/me/avatar', accessTokenValidator, wrapRequestHandler(updateAvatarController))

/**
 * Send a verification email to the current user
 * - Method: POST
 * - Path: /me/email-verification
 * - Protected: requires `Authorization: Bearer <access_token>`
 * - Action: generates an email verification token and sends a verification email to the user's address
 * - Success: 200 with a message instructing the user to check their email
 */
usersRouter.post(
  '/me/email-verification',
  accessTokenValidator,
  sendEmailValidator,
  wrapRequestHandler(sendEmailController)
)

/**
 * Verify a user's email using an email verification token
 * - Method: POST
 * - Path: /verify-email
 * - Public: no authentication required
 * - Body: `{ email_verify_token: string }`
 * - Action: validates token, marks the user as verified and issues new auth tokens
 * - Success: 200 with new `{ access_token, refresh_token }`
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))

/**
 * Initiate the forgot-password flow by sending a reset link
 * - Method: POST
 * - Path: /forgot-password
 * - Public: accepts `{ email: string }` in the body
 * - Action: verifies the email exists and sends a reset email containing a token
 * - Success: 200 with a message instructing the user to check their email
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * Verify a forgot-password token sent by email
 * - Method: POST
 * - Path: /verify-forgot-password
 * - Public: accepts `{ forgot_password_token: string }` in the body
 * - Action: validates the token so the client may proceed to reset the password
 * - Success: 200 with a confirmation message
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordController)
)

/**
 * Reset a user's password using a verified forgot-password token
 * - Method: POST
 * - Path: /reset-password
 * - Public: body must include `{ password, confirm_password, forgot_password_token }`
 * - Validations: `resetPasswordValidator` ensures token validity and password rules
 * - Action: updates the user's password and clears the forgot-password token
 * - Success: 200 with a message confirming password reset
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

export default usersRouter
