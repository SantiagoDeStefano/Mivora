import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Container from '../../components/Container/Container'
import path from '../../constants/path'
import ticketsApi, {
  Ticket,
  TicketApi,
  GetMyTicketsResponse,
mapTicketApiToTicket
} from '../../apis/tickets.api'
import { GetOrSearchMyTicketsSchema } from '../../utils/rules'
import { socket } from '../../utils/socket'
import Popup from '../../components/Popup/Popup'

// UUID v4 giống rule getTicketDetails / cancelTicket
const TICKET_ID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const LIMIT = 50

const formatPrice = (price_cents: number) => {
  const value = price_cents / 100
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  })
}

const formatCheckedIn = (iso: string | null) => {
  if (!iso) return 'Not checked in'
  try {
    const d = new Date(iso)
    return d.toLocaleString()
  } catch {
    return iso
  }
}

export default function MyTicketDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [cancelingId, setCancelingId] = useState<string | null>(null)
  const [popupOpen, setPopupOpen] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [popupVariant, setPopupVariant] = useState<'success' | 'error' | 'info'>(
    'info'
  )

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmingTicketId, setConfirmingTicketId] = useState<string | null>(
    null
  )

  // Fetch toàn bộ ticket của user (như MyTicketsPage)
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true)
        setError(null)

        let page = 1
        let all: Ticket[] = []

        while (true) {
          const params: GetOrSearchMyTicketsSchema = {
            limit: LIMIT,
            page
          }

          const res = await ticketsApi.searchMyTickets(params)
          const result: GetMyTicketsResponse = res.data.result

          const mapped: Ticket[] = result.tickets.map((raw: TicketApi) =>
            mapTicketApiToTicket(raw)
          )

          all = all.concat(mapped)

          if (result.page >= result.total_page) break
          page++
        }

        setTickets(all)
      } catch (err: any) {
        console.error('Failed to load tickets for reels:', err)
        setError(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            'Failed to load tickets.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  // Behavior “reels”: auto chọn ticket đầu tiên nếu không có id,
  // scroll tới slide đang active, và gán phím ↑ / ↓ để nhảy giữa các ticket.
  useEffect(() => {
    if (loading || !tickets.length) return

    let currentId = id?.trim().toLowerCase()

    if (!currentId || !TICKET_ID_REGEX.test(currentId)) {
      const firstId = tickets[0]?.id
      if (firstId) {
        navigate(path.my_ticket_details.replace(':id', firstId), {
          replace: true
        })
      }
      return
    }

    const el = document.getElementById(currentId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const onKey = (e: KeyboardEvent) => {
      const idx = tickets.findIndex((t) => t.id === currentId)
      if (idx < 0) return

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (idx < tickets.length - 1) {
          const nextId = tickets[idx + 1].id
          currentId = nextId
          navigate(path.my_ticket_details.replace(':id', nextId))
        }
      }

      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (idx > 0) {
          const prevId = tickets[idx - 1].id
          currentId = prevId
          navigate(path.my_ticket_details.replace(':id', prevId))
        }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [id, tickets, loading, navigate])

  // Reload khi server emit sau khi scan QR
  useEffect(() => {
    const handler = () => {
      console.log('reload_after_scan received, reloading page')
      navigate(0)
    }

    socket.on('reload_after_scan', handler)

    return () => {
      socket.off('reload_after_scan', handler)
    }
  }, [navigate])

  const handleOpenCancelConfirm = (ticketId: string) => {
    setConfirmingTicketId(ticketId)
    setConfirmOpen(true)
  }

  const handleConfirmCancel = async () => {
    if (!confirmingTicketId) return

    try {
      setCancelingId(confirmingTicketId)
      await ticketsApi.cancelTicket(confirmingTicketId)

      setTickets((prev) =>
        prev.map((t) =>
          t.id === confirmingTicketId
            ? ({ ...t, status: 'canceled' } as Ticket)
            : t
        )
      )

      setPopupMessage('Ticket canceled successfully.')
      setPopupVariant('success')
      setPopupOpen(true)

      // Sau khi hủy xong, quay về trang danh sách vé
      navigate(path.my_tickets)
    } catch (err: any) {
      console.error('Failed to cancel ticket:', err)
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Failed to cancel ticket.'
      setPopupMessage(msg)
      setPopupVariant('error')
      setPopupOpen(true)
    } finally {
      setCancelingId(null)
      setConfirmOpen(false)
      setConfirmingTicketId(null)
    }
  }

  const handleCancelConfirm = () => {
    setConfirmOpen(false)
    setConfirmingTicketId(null)
  }

  // Loading UI
  if (loading) {
    return (
      <section className="min-h-screen bg-slate-950 py-8 sm:py-10">
        <Container>
          <div className="max-w-2xl mx-auto flex items-center justify-center min-h-[70vh]">
            <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/70 px-6 py-8 shadow-xl">
              <div className="h-4 w-32 bg-slate-800 rounded-md animate-pulse mb-3" />
              <div className="h-7 w-40 bg-slate-800 rounded-md animate-pulse mb-6" />
              <div className="h-40 w-full bg-slate-800 rounded-2xl animate-pulse" />
            </div>
          </div>
        </Container>
      </section>
    )
  }

  if (error || !tickets.length) {
    return (
      <section className="min-h-screen bg-slate-950 py-8 sm:py-10">
        <Container>
          <div className="max-w-2xl mx-auto flex items-center justify-center min-h-[70vh]">
            <div className="w-full rounded-3xl border border-red-700/70 bg-red-900/40 px-6 py-8 text-center shadow-xl">
              <h1 className="text-xl sm:text-2xl font-semibold text-red-100">
                Ticket not found
              </h1>
              <p className="mt-2 text-sm text-red-200">
                {error || 'We could not find your tickets.'}
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => navigate(path.my_tickets)}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-800 border border-slate-600"
                >
                  Back to my tickets
                </button>
                <button
                  onClick={() => navigate(path.home)}
                  className="rounded-full bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700 shadow"
                >
                  Discover events
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    )
  }

  const activeId = id?.trim().toLowerCase() || tickets[0].id

  return (
    <section className="min-h-screen bg-slate-950 py-4 sm:py-6">
      <Container>
        <div className="max-w-2xl mx-auto">
          {tickets.map((ticket) => {
            const isActive = ticket.id === activeId
            const isBooked = ticket.status === 'booked'
            const isCheckedIn = ticket.status === 'checked_in'
            const isCanceled = ticket.status === 'canceled'

            let statusLabel = 'Booked'
            let statusClass =
              'inline-flex items-center rounded-full bg-black/30 px-3 py-1 text-[11px] font-medium text-pink-50'

            if (isCheckedIn) {
              statusLabel = 'Checked-in'
            } else if (isCanceled) {
              statusLabel = 'Canceled'
              statusClass =
                'inline-flex items-center rounded-full bg-red-600 px-3 py-1 text-[11px] font-medium text-white'
            }

            return (
              <div
                id={ticket.id}
                key={ticket.id}
                className={`min-h-[90vh] flex items-center py-8 transition-opacity duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-60'
                }`}
              >
                <div
                  className={[
                    'w-full rounded-[28px] border bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900',
                    'px-6 py-7 sm:px-8 sm:py-9 shadow-[0_18px_60px_rgba(15,23,42,0.9)]',
                    'transform transition-transform duration-300',
                    isActive
                      ? 'scale-100 border-slate-700 ring-4 ring-pink-500/30'
                      : 'scale-95 border-slate-800'
                  ].join(' ')}
              >
                  {/* Header strip */}
                  <div className="mb-5 rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-pink-50/80">
                        Ticket
                      </p>
                      <p className="text-sm font-semibold text-white line-clamp-1">
                        {ticket.event_title}
                      </p>
                    </div>
                    <span className={statusClass}>{statusLabel}</span>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                    {/* Left info */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-slate-400">
                          Event
                        </p>
                        <p className="mt-1 text-xl sm:text-2xl font-semibold text-slate-50">
                          {ticket.event_title}
                        </p>
                        {ticket.event_status && (
                          <p className="mt-1 text-xs text-slate-400">
                            Status:{' '}
                            <span className="font-medium text-slate-200">
                              {ticket.event_status}
                            </span>
                          </p>
                        )}
                      </div>

                      <div className="pt-2 space-y-1">
                        <p className="text-xs text-slate-400">Price</p>
                        <p className="text-2xl font-semibold text-slate-50">
                          {formatPrice(ticket.price_cents)}
                        </p>
                      </div>

                      <div className="pt-2 space-y-1">
                        <p className="text-xs text-slate-400">Checked in</p>
                        <p className="text-sm font-medium text-slate-100">
                          {formatCheckedIn(ticket.checked_in_at)}
                        </p>
                      </div>

                      <div className="pt-2 space-y-1">
                        <p className="text-xs text-slate-400">Ticket ID</p>
                        <p className="text-[11px] font-mono text-slate-300 break-all">
                          {ticket.id}
                        </p>
                      </div>
                    </div>

                    {/* QR side */}
                    <div className="w-full sm:w-60 flex flex-col items-center sm:items-stretch gap-2">
                      <div className="w-full rounded-3xl bg-slate-900/80 border border-slate-700 px-4 py-4 flex items-center justify-center">
                        {ticket.qr_code && !isCanceled ? (
                          <img
                            src={ticket.qr_code}
                            alt="Ticket QR"
                            className="w-40 h-40 sm:w-44 sm:h-44 object-contain"
                          />
                        ) : (
                          <div className="w-40 h-40 sm:w-44 sm:h-44 bg-slate-800 rounded-2xl flex items-center justify-center text-xs text-slate-400">
                            {isCanceled ? 'Ticket canceled' : ''}
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 text-center">
                        Show this QR at the venue to check in. Do not share it
                        publicly.
                      </p>
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigate(path.my_tickets)}
                        className="inline-flex items-center justify-center rounded-full border border-slate-600 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-800"
                      >
                        Back to my tickets
                      </button>

                      {/* Cancel ticket – chỉ cho booked */}
                      {isBooked && (
                        <button
                          onClick={() => handleOpenCancelConfirm(ticket.id)}
                          disabled={cancelingId === ticket.id}
                          className="inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {cancelingId === ticket.id
                            ? 'Canceling…'
                            : 'Cancel ticket'}
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Use ↑ / ↓ or PageUp / PageDown to switch tickets
                    </p>
                  </div>

                  {/* Confirmation Popup - Inside the card */}
                  {confirmOpen && confirmingTicketId === ticket.id && (
                    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                      <div
                        className="absolute inset-0"
                        onClick={handleCancelConfirm}
                      />
                      <div className="relative w-[92%] max-w-sm rounded-2xl border border-gray-700 bg-gradient-to-b from-gray-900 via-gray-900/95 to-black p-6 shadow-2xl">
                        <h2 className="mb-3 text-lg font-semibold text-white tracking-wide">
                          Confirm Cancel
                        </h2>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          Are you sure you want to cancel this ticket? This
                          action cannot be undone.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                          <button
                            onClick={handleCancelConfirm}
                            disabled={cancelingId !== null}
                            className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 disabled:opacity-60 transition"
                          >
                            No, keep it
                          </button>
                          <button
                            onClick={handleConfirmCancel}
                            disabled={cancelingId !== null}
                            className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 disabled:opacity-60 transition"
                          >
                            {cancelingId ? 'Canceling…' : 'Yes, cancel'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Container>

      {/* Notification Popup */}
      <Popup
        open={popupOpen}
        title={
          popupVariant === 'success'
            ? 'Success'
            : popupVariant === 'error'
            ? 'Error'
            : 'Notification'
        }
        message={popupMessage}
        variant={popupVariant}
        onClose={() => setPopupOpen(false)}
      />
    </section>
  )
}
