import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TICKETS_MESSAGES } from '~/constants/messages'
import { BookTicketRequestBody, ScanTicketRequestBody } from '~/models/requests/tickets.requests'
import { TokenPayload } from '~/models/requests/users.requests'

import Event from '~/models/schemas/Event.schema'
import Ticket from '~/models/schemas/Tickets.schema'
import ticketsService from '~/services/tickets.services'

export const bookTicketController = async (
  req: Request<ParamsDictionary, unknown, BookTicketRequestBody>,
  res: Response
): Promise<void> => {
  const eventData = (req.event as Event[])[0]
  const event_id = eventData.id
  const user_id = (req.decoded_authorization as TokenPayload).user_id
  const price_cents = eventData.price_cents
  const result = await ticketsService.bookTicket(event_id, user_id, price_cents)
  res.json({
    message: TICKETS_MESSAGES.BOOK_TICKET_SUCCESS,
    result
  })
}

export const scanTicketController = async (
  req: Request<ParamsDictionary, unknown, ScanTicketRequestBody>,
  res: Response
): Promise<void> => {
  const ticketData = (req.ticket as Ticket[])[0]
  const ticket_id = ticketData.id
  await ticketsService.scanTicket(ticket_id)
  res.json({
    message: TICKETS_MESSAGES.TICKET_SCANNED_SUCCESS
  })
}
