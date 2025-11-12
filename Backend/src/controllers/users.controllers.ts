import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { USERS_MESSAGES } from '~/constants/messages'
import {
  ForgotPasswordRequestBody,
  LoginRequestBody,
  LogoutRequestBody,
  RefreshTokenRequestBody,
  RegisterRequestBody,
  ResetPasswordRequestBody,
  TokenPayload,
  UpdateMeRequestBody,
  VerifyEmailRequestBody,
  VerifyForgotPasswordRequestBody
} from '~/models/requests/users.requests'
import { UUIDv4 } from '~/types/common'
import { UserVerificationStatus } from '~/types/domain'
import User from '~/models/schemas/User.schema'
import userService from '~/services/users.services'
import mediasService from '~/services/medias.services'

export const registerController = async (
  req: Request<ParamsDictionary, unknown, RegisterRequestBody>,
  res: Response
): Promise<void> => {
  const result = await userService.register(req.body)
  res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
  return
}

export const loginController = async (
  req: Request<ParamsDictionary, unknown, LoginRequestBody>,
  res: Response
): Promise<void> => {
  const user = req.user
  const user_id = user?.id as UUIDv4
  const verified = user?.verified as UserVerificationStatus
  const result = await userService.login(user_id, verified)
  res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
  return
}

export const logoutController = async (
  req: Request<ParamsDictionary, unknown, LogoutRequestBody>,
  res: Response
): Promise<void> => {
  const { refresh_token } = req.body
  const result = await userService.logout(refresh_token)
  res.json({
    result
  })
  return
}

export const refreshTokenController = async (
  req: Request<ParamsDictionary, unknown, RefreshTokenRequestBody>,
  res: Response
): Promise<void> => {
  const { refresh_token } = req.body
  const { user_id, verify, exp } = req.decoded_refresh_token as TokenPayload
  const result = await userService.refreshToken({ user_id, refresh_token, verify, exp })
  res.json({
    message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESS,
    result
  })
  return
}

export const getMeController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await userService.getMe(user_id)
  res.json({
    message: USERS_MESSAGES.GET_PROFILE_SUCCESS,
    result
  })
  return
}

export const updateMeController = async (
  req: Request<ParamsDictionary, unknown, UpdateMeRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await userService.updateMe(user_id, req.body)
  res.json({
    message: USERS_MESSAGES.UPDATE_ME_SUCCESS,
    result
  })
  return
}

export const updateAvatarController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const url = await mediasService.uploadImage(req)
  const result = await userService.updateAvatar(user_id, url[0].url)
  res.json({
    message: USERS_MESSAGES.UPDATE_AVATAR_SUCCESS,
    result
  })
  return
}

export const sendEmailController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user = req.user as User
  const user_id = user.id
  const user_email = user.email
  await userService.sendEmailVerifyToken(user_id, user_email)
  res.json({
    message: USERS_MESSAGES.SEND_VERIFY_EMAIL_SUCCESS
  })
  return
}

export const verifyEmailController = async (
  req: Request<ParamsDictionary, unknown, VerifyEmailRequestBody>,
  res: Response
): Promise<void> => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const result = await userService.verifyEmail(user_id)
  res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result
  })
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, unknown, ForgotPasswordRequestBody>,
  res: Response
): Promise<void> => {
  const { id, verified, email } = req.user as User
  await userService.forgotPassword({ user_id: id, verify: verified, email })
  res.json({
    message: USERS_MESSAGES.CHECK_YOUR_EMAIL_FOR_RESET_PASSWORD_LINK
  })
  return
}

export const verifyForgotPasswordController = async (
  req: Request<ParamsDictionary, unknown, VerifyForgotPasswordRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  res.json({
    message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS
  })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, unknown, ResetPasswordRequestBody>,
  res: Response
): Promise<void> => {
  const { user_id } = req.decoded_forgot_password_token as TokenPayload
  const password = req.body.confirm_password
  await userService.resetPassword(user_id, password)
  res.json({
    message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS
  })
}
