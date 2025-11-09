import { CreateEventRequestBody, UpdateEventDetailsBody } from '~/models/requests/events.requests'
import databaseService from './database.services'
import Event from '~/models/schemas/Event.schema'
import { UUIDv4 } from '~/types/common'
import { EventStatus } from '~/types/domain'
import { signToken } from '~/utils/jwt'
import qrCode from './qrcode.services'
import Ticket from '~/models/schemas/Tickets.schema'

class TicketsService {
  async bookTicket(event_id: UUIDv4, user_id: UUIDv4, price_cents: number) {
    // Sign QRCode
    const qr_code_token = await qrCode.createQrTicketToken(event_id, user_id)
    const new_ticket = new Ticket({
      event_id,
      user_id,
      qr_code_token,
      price_cents
    })
    await databaseService.tickets(
      `
        INSERT INTO tickets(
          id,
          event_id,
          user_id,
          qr_code_token,
          status,
          checked_in_at,
          price_cents
        )
        VALUES(
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7
        )
      `,
      [
        new_ticket.id,
        new_ticket.event_id,
        new_ticket.user_id,
        new_ticket.qr_code_token,
        new_ticket.status,
        new_ticket.checked_in_at,
        new_ticket.price_cents
      ]
    )
    const newEvent = await databaseService.tickets(
      `
        SELECT
          id,
          event_id,
          user_id,
          status,
          checked_in_at,
          price_cents
        FROM tickets
        WHERE id=$1
      `,
      [new_ticket.id]
    )
    const qr_code = await qrCode.generateQrTicketCode(qr_code_token)
    return {
      ticket: newEvent.rows[0],
      qr_code
    }
  }
}

const ticketsService = new TicketsService()
export default ticketsService
