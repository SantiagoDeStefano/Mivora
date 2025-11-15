import { NextFunction } from 'express-serve-static-core'
import { TokenPayload } from '~/models/requests/users.requests'
import { Request, Response } from 'express'
import databaseService from '~/services/database.services'
import Event from '~/models/schemas/Event.schema'
import ErrorWithStatus from '~/models/Errors'
import { TICKETS_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import { validate } from '~/utils/validation'
import { checkSchema } from 'express-validator'
import { verifyToken } from '~/utils/jwt'
import { envConfig } from '~/constants/config'

export const bookTicketValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const event_id = (req.event as Event[])[0].id
  const userEventCount = await databaseService.tickets(
    `SELECT COUNT(id) FROM tickets WHERE user_id=$1 AND event_id=$2`,
    [user_id, event_id]
  )
  if (userEventCount.rows[0].count >= 1) {
    return next(
      new ErrorWithStatus({
        message: USERS_MESSAGES.ONE_USER_PER_EVENT_ONLY,
        status: HTTP_STATUS.FORBIDDEN
      })
    )
  }
  next()
}

// export const scanTicketValidator = validate(
//   checkSchema(
//     {
//       qr_code_token: {
//         custom: {
//           options: async (value: string, { req }) => {
//             if (!value) {
//               throw new ErrorWithStatus({
//                 message: TICKETS_MESSAGES.QR_CODE_TOKEN_REQUIRED,
//                 status: HTTP_STATUS.BAD_REQUEST
//               })
//             }
//             try {
//               const decoded_qr_code_token = await verifyToken({
//                 token: value,
//                 secretOrPublicKey: envConfig.jwtSecretQRCodeToken as string
//               })
//               const { user_id, event_id } = decoded_qr_code_token
//               const ticket = await databaseService.users(
//                 `SELECT COUNT(id) FROM tickets WHERE user_id=$1 AND event_id=$2`,
//                 [user_id, event_id]
//               )
//               if (ticket.rows[0].) {
//                 throw new ErrorWithStatus({
//                   message: USERS_MESSAGES.USER_NOT_FOUND,
//                   status: HTTP_STATUS.NOT_FOUND
//                 })
//               }
//               if (user.rows[0].email_verify_token != value) {
//                 throw new ErrorWithStatus({
//                   message: USERS_MESSAGES.INVALID_EMAIL_VERIFY_TOKEN,
//                   status: HTTP_STATUS.UNAUTHORIZED
//                 })
//               }
//               req.decoded_email_verify_token = decoded_email_verify_token
//             } catch (error) {
//               throw new ErrorWithStatus({
//                 message: capitalize((error as JsonWebTokenError).message),
//                 status: HTTP_STATUS.UNAUTHORIZED
//               })
//             }
//             return true
//           }
//         }
//       }
//     },
//     ['body']
//   )
// )
