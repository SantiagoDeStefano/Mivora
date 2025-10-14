import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { USERS_MESSAGES } from '~/constants/messages'
import {
  LoginRequestBody,
  LogoutRequestBody,
  RefreshTokenRequestBody,
  RegisterRequestBody,
  TokenPayload,
  UpdateMeRequestBody
} from '~/models/requests/users.requests'
import { UUIDv4 } from '~/types/common'
import userService from '~/services/users.services'
import { body } from 'express-validator'

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
  const user_id = req.user_id as UUIDv4
  console.log(user_id)
  const result = await userService.login(user_id)
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
  const { user_id, exp } = req.decoded_refresh_token as TokenPayload
  const result = await userService.refreshToken({ user_id, refresh_token, exp })
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
