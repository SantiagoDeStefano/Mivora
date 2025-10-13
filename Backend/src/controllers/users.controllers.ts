import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { USERS_MESSAGES } from '~/constants/messages'
import {
  LoginRequestBody,
  LogoutRequestBody,
  RefreshTokenRequestBody,
  RegisterRequestBody,
  TokenPayload
} from '~/models/requests/users.requests'
import { UUIDv4 } from '~/types/common'
import userService from '~/services/users.services'

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
