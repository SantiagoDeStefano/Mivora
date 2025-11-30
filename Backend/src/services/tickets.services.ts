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
    const ticketResult = await databaseService.tickets(
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
    const ticket = ticketResult.rows[0]
    await databaseService.events(
      `
        UPDATE events
        SET checked_in = checked_in + 1
        WHERE id = $1
      `,
      [ticket.event_id]
    )
    return { ticket }
  }
  async getOrSearchTicketWithStatus(limit: number, page: number, search?: string, status?: TicketStatus) {
    const statusParam = status ?? null // null = "all statuses"
    const searchParam = search ?? null // null = "no search"
    const ticketsResult = await databaseService.tickets(
      `
        SELECT 
          tickets.id, 
          events.title, 
          tickets.user_id, 
          tickets.status, 
          tickets.checked_in_at, 
          tickets.price_cents, 
          tickets.qr_code_token
        FROM tickets  
        JOIN events ON tickets.event_id = events.id
        WHERE
          tickets.status = COALESCE($1::ticket_status, tickets.status)
          AND
          events.title ILIKE COALESCE('%' || $2::text || '%', events.title)
        ORDER BY tickets.created_at DESC, tickets.id DESC
        LIMIT $3 OFFSET $4
      `,
      [statusParam, searchParam, limit, limit * (page - 1)]
    )
    const totalTickets = ticketsResult.rows.length
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

    return { tickets, totalTickets }
  }
}

const ticketsService = new TicketsService()
export default ticketsService
