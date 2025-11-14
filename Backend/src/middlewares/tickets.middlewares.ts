import { NextFunction } from 'express-serve-static-core'
import { TokenPayload } from '~/models/requests/users.requests'
import { Request, Response } from 'express'
import databaseService from '~/services/database.services'
import Event from '~/models/schemas/Event.schema'
import ErrorWithStatus from '~/models/Errors'
import { USERS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'

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
