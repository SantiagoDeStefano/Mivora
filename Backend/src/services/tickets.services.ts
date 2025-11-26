import { UUIDv4 } from '~/types/common'

import databaseService from './database.services'
import qrCode from './qrcode.services'
import Ticket from '~/models/schemas/Tickets.schema'
import { TicketStatus } from '~/types/domain'

class TicketsService {
  async bookTicket(event_id: UUIDv4, user_id: UUIDv4, price_cents: number) {
    // Sign QR code token
    const qr_code_token = await qrCode.createQrTicketToken(event_id, user_id)
    const new_ticket = new Ticket({
      event_id,
      user_id,
      qr_code_token,
      price_cents
    })
    const newTicket = await databaseService.tickets(
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
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING
      id,
      event_id,
      user_id,
      status,
      checked_in_at,
      price_cents,
      qr_code_token
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
    const qr_code = await qrCode.generateQrTicketCode(qr_code_token)
    const { qr_code_token: token, ...ticketWithoutToken } = newTicket.rows[0]
    return {
      ticket: {
        ...ticketWithoutToken,
        qr_code
      }
    }
  }

  async scanTicket(ticket_id: UUIDv4) {
    const ticket = await databaseService.tickets(
      `
        UPDATE tickets
        SET status = $1,
            checked_in_at = $2
        WHERE id = $3
        RETURNING
          id,
          event_id,
          user_id,
          status,
          checked_in_at,
          price_cents
      `,
      ['checked_in', new Date(), ticket_id]
    )
    return { ticket: ticket.rows[0] }
  }
  async getTicketWithStatus(status: TicketStatus, limit: number, page: number) {
    const ticketsResult = !status
      ? await databaseService.tickets(
          `
            SELECT id, event_id, user_id, status, checked_in_at, price_cents, qr_code_token
            FROM tickets
            ORDER BY created_at DESC, id DESC 
            LIMIT $1 OFFSET $2
          `,
          [limit, limit * (page - 1)]
        )
      : await databaseService.tickets(
          `
            SELECT id, event_id, user_id, status, checked_in_at, price_cents, qr_code_token
            FROM tickets WHERE status=$1
            ORDER BY created_at DESC, id DESC 
            LIMIT $2 OFFSET $3
          `,
          [status, limit, limit * (page - 1)]
        )
    const tickets = await Promise.all(
      ticketsResult.rows.map(async (ticket) => {
        const qr_code = await qrCode.generateQrTicketCode(ticket.qr_code_token)

        // remove token and attach generated QR
        const { qr_code_token, ...ticketWithoutToken } = ticket

        return {
          ...ticketWithoutToken,
          qr_code
        }
      })
    )

    return { tickets }
  }
}

const ticketsService = new TicketsService()
export default ticketsService
