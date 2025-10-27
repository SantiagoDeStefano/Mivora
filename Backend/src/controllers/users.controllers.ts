import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { USERS_MESSAGES } from '~/constants/messages'
import {
  LoginRequestBody,
  LogoutRequestBody,
  RefreshTokenRequestBody,
  RegisterRequestBody,
  TokenPayload,
  UpdateMeRequestBody,
  VerifyEmailRequestBody
} from '~/models/requests/users.requests'
import { UUIDv4 } from '~/types/common'
import userService from '~/services/users.services'
import databaseService from '~/services/database.services'
import HTTP_STATUS from '~/constants/httpStatus'
import { UserVerificationStatus } from '~/types/domain'
import User from '~/models/schemas/User.schema'

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
  const user = await databaseService.users(`SELECT id, email_verify_token FROM users WHERE id=$1`, [user_id])

  //If user not found then we return HTTP 404 Not Found
  if (user.rows.length <= 0) {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      error: USERS_MESSAGES.USER_NOT_FOUND
    })
    return
  }

  //Verified so we don't throw error
  //Instead, we return HTTP 200 OK with "Already verified" message
  if (user.rows[0].email_verify_token == '') {
    res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED
    })
    return
  }
  //If not verify then we assign user to req.user to use in controller
  const result = await userService.verifyEmail(user_id)

  res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result
  })
}
