import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { USERS_MESSAGES } from '~/constants/messages'
import { LoginRequestBody, RegisterRequestBody } from '~/models/requests/users.requests'
import userService from '~/services/users.services'
import { UUIDv4 } from '~/types/common'

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
}
