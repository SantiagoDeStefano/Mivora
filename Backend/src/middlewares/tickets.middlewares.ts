import { NextFunction } from 'express-serve-static-core'
import { TokenPayload } from '~/models/requests/users.requests'
import { Request, Response } from 'express'
import { EVENTS_MESSAGES, TICKETS_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import { validate } from '~/utils/validation'
import { checkSchema } from 'express-validator'
import { verifyToken } from '~/utils/jwt'
import { envConfig } from '~/constants/config'
import { capitalize } from 'lodash'
import { JsonWebTokenError } from 'jsonwebtoken'
import { TicketStatus } from '~/types/domain'

import Ticket from '~/models/schemas/Tickets.schema'
import databaseService from '~/services/database.services'
import Event from '~/models/schemas/Event.schema'
import ErrorWithStatus from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

const ticket_status: TicketStatus[] = ['booked', 'checked_in']

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

export const scanTicketValidator = validate(
  checkSchema(
    {
      qr_code_token: {
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: TICKETS_MESSAGES.QR_CODE_TOKEN_REQUIRED,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            try {
              const decoded_qr_code_token = await verifyToken({
                token: value,
                secretOrPublicKey: envConfig.jwtSecretQRCodeToken as string
              })
              const { user_id, event_id } = decoded_qr_code_token
              const ticket = await databaseService.users(
                `SELECT id, status FROM tickets WHERE user_id=$1 AND event_id=$2`,
                [user_id, event_id]
              )
              if (ticket.rows.length <= 0) {
                throw new ErrorWithStatus({
                  message: TICKETS_MESSAGES.TICKET_NOT_FOUND,
                  status: HTTP_STATUS.NOT_FOUND
                })
              }
              if (ticket.rows[0].status == 'checked_in') {
                throw new ErrorWithStatus({
                  message: TICKETS_MESSAGES.TICKET_ALREADY_CHECKED_IN,
                  status: HTTP_STATUS.NOT_FOUND
                })
              }
              req.ticket = ticket.rows
            } catch (error) {
              throw new ErrorWithStatus({
                message: capitalize((error as JsonWebTokenError).message),
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const eventCreatorValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { id: event_id } = (req.ticket as Ticket[])[0]
  const { user_id } = req.decoded_authorization as TokenPayload
  const events = await databaseService.events(
    `
      SELECT events.organizer_id 
      FROM events 
      JOIN tickets ON tickets.event_id = events.id
      WHERE tickets.id = $1
    `,
    [event_id]
  )
  if (events.rows.length <= 0) {
    return next(
      new ErrorWithStatus({
        message: EVENTS_MESSAGES.EVENT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    )
  }
  if (user_id != events.rows[0].organizer_id) {
    return next(
      new ErrorWithStatus({
        message: TICKETS_MESSAGES.USER_IS_NOT_EVENT_ORGANIZER,
        status: HTTP_STATUS.FORBIDDEN
      })
    )
  }
  next()
}

export const getTicketStatusValidator = validate(
  checkSchema(
    {
      status: {
        optional: { options: { nullable: true } },
        isIn: {
          options: [ticket_status],
          errorMessage: TICKETS_MESSAGES.TICKET_STATUS_MUST_BE_BOOKED_CHECKED_IN
        }
      }
    },
    ['query']
  )
)
