// src/pages/Tickets/TicketSuccess.tsx
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

import path from '../../constants/path'
import Container from '../../components/Container/Container'
import ticketsApi, { Ticket, BookTicketResult } from '../../apis/tickets.api'
import { SuccessResponse } from '../../types/response.types'

type BookingResponse = SuccessResponse<BookTicketResult>

type LocationState = {
  ticket?: Ticket
  response?: BookingResponse
  eventId?: string
  eventTitle?: string
}

// UUID theo rule bookTicket
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export default function TicketSuccess() {
  const location = useLocation()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<BookingResponse | null>(null)

  const state = (location.state || {}) as LocationState
  const searchParams = new URLSearchParams(location.search)

  // Lấy eventId theo thứ tự ưu tiên: state -> query
  const eventIdFromState = state.eventId
  const eventIdFromQuery =
    searchParams.get('eventId') || searchParams.get('event_id') || undefined

  const eventId = eventIdFromState || eventIdFromQuery || undefined

  useEffect(() => {
    let cancelled = false

    const bootstrap = async () => {
      // 1. Có response trong state -> dùng luôn
      if (state.response) {
        setResponse(state.response)
        setLoading(false)
        return
      }

      // 2. Có ticket trong state -> wrap thành BookingResponse
      if (state.ticket) {
        const result: BookTicketResult = {
          ticket: state.ticket
        }

        setResponse({
          message: 'Book ticket successfully',
          result
        })
        setLoading(false)
        return
      }

      // 3. Không có gì -> fallback: tự book bằng eventId
      if (!eventId) {
        setError('Missing event id.')
        setLoading(false)
        return
      }

      if (!UUID_REGEX.test(eventId)) {
        setError('Invalid event id.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const res = await ticketsApi.bookTicket(eventId)
        const data = res.data as BookingResponse
        if (cancelled) return
        setResponse(data)
      } catch (err) {
        console.error('Book ticket failed:', err)
        if (cancelled) return

        if (axios.isAxiosError(err)) {
          const data: any = err.response?.data
          const msg =
            data?.message || data?.error || data?.detail || 'Failed to book ticket.'
          setError(msg)
        } else {
          setError('Failed to book ticket.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    bootstrap()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key])

  // Loading UI
  if (loading) {
    return (
      <section className='py-10 sm:py-14'>
        <Container>
          <div className='w-full max-w-2xl mx-auto'>
            <div className='rounded-2xl border border-gray-800 bg-gray-900 p-6'>
              <div className='h-5 w-32 bg-gray-800 rounded-md animate-pulse mb-3' />
              <div className='h-8 w-64 bg-gray-800 rounded-md animate-pulse mb-6' />
              <div className='h-40 w-full bg-gray-800 rounded-xl animate-pulse' />
            </div>
          </div>
        </Container>
      </section>
    )
  }

  // Error UI
  if (error || !response) {
    return (
      <section className='py-10 sm:py-14'>
        <Container>
          <div className='w-full max-w-2xl mx-auto text-center'>
            <div className='rounded-2xl border border-red-700 bg-red-900/40 px-6 py-8'>
              <h2 className='text-xl font-semibold text-gray-100'>Booking failed</h2>
              <p className='mt-2 text-sm text-red-200'>
                {error || 'Could not book ticket.'}
              </p>
              <div className='mt-4 flex justify-center gap-3'>
                <button
                  type='button'
                  onClick={() => navigate(path.home)}
                  className='rounded-xl bg-gray-800 px-4 py-2 text-sm font-medium text-gray-100 hover:bg-gray-700'
                >
                  Back to home
                </button>
                {eventId && (
                  <button
                    type='button'
                    onClick={() =>
                      navigate(path.event_details.replace(':event_id', eventId))
                    }
                    className='rounded-xl bg-pink px-4 py-2 text-sm font-medium text-white hover:bg-pink-700'
                  >
                    View event
                  </button>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
    )
  }

  // Chuẩn hóa result: giờ CHẮC CHẮN là { ticket }
  const ticket = response.result.ticket

  // eventId cuối cùng: state -> query -> ticket.event_id
  const effectiveEventId = eventId || ticket.event_id
  const eventTitle = state.eventTitle || 'Event'

  const priceCents = ticket.price_cents
  const priceLabel = priceCents
    ? `$${(priceCents / 100).toFixed(2)}`
    : 'Free ticket'

  const isCheckedIn = Boolean(ticket.checked_in_at)

  const formatCheckedIn = (value: string | number | null) => {
    if (!value) return 'Not checked in yet'
    try {
      const d = new Date(value)
      return isNaN(d.getTime()) ? String(value) : d.toLocaleString()
    } catch {
      return String(value)
    }
  }

  const handleViewEvent = () => {
    if (!effectiveEventId) return
    navigate(path.event_details.replace(':event_id', effectiveEventId))
  }

  const handleGoToMyTickets = () => {
    navigate(path.my_tickets)
  }

  const qrSrc = ticket.qr_code || ''

  return (
    <section className='py-10 sm:py-14'>
      <Container>
        <div className='w-full max-w-2xl mx-auto'>
          <div className='overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100'>
            {/* Header */}
            <div className='border-b border-gray-100 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 px-6 py-4 text-white'>
              <div className='text-xl uppercase font-bold tracking-[0.15em] opacity-80'>
                Ticket booked
              </div>
            </div>

            {/* Body */}
            <div className='px-6 py-6 sm:py-7'>
              <div className='flex flex-col gap-6 sm:flex-row sm:items-start'>
                {/* QR */}
                <div className='flex justify-center sm:block'>
                  <div className='inline-flex flex-col items-center gap-2'>
                    <div className='rounded-xl bg-white p-2 shadow-sm'>
                      {qrSrc ? (
                        <img
                          src={qrSrc}
                          alt='Ticket QR'
                          className='h-40 w-40 sm:h-44 sm:w-44 rounded-lg object-contain'
                        />
                      ) : (
                        <div className='h-40 w-40 sm:h-44 sm:w-44 rounded-lg bg-gray-100' />
                      )}
                    </div>
                    <p className='text-xs text-gray-500 text-center'>
                      Scan this QR at the entrance to check in.
                    </p>
                  </div>
                </div>

                {/* Right content */}
                <div className='flex-1 space-y-5'>
                  <div>
                    <div className='text-xs uppercase tracking-wide text-gray-200'>
                      Ticket price
                    </div>
                    <div className='mt-1 text-3xl sm:text-4xl font-semibold text-gray-200'>
                      {priceLabel}
                    </div>
                    <div className='mt-2 text-sm text-gray-200'>
                      Event:{' '}
                      <span className='font-medium text-gray-200'>{eventTitle}</span>
                    </div>
                    <div className='mt-2 text-xs text-gray-200'>
                      {isCheckedIn
                        ? `Checked in at ${formatCheckedIn(ticket.checked_in_at)}`
                        : 'Not checked in yet'}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className='flex flex-wrap gap-3'>
                    {effectiveEventId && (
                      <button
                        type='button'
                        onClick={handleViewEvent}
                        className='mt-4 inline-flex items-center justify-center rounded-full border border-gray-200 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-800 active:bg-gray-200 transition'
                      >
                        View event
                      </button>
                    )}

                    <button
                      type='button'
                      onClick={handleGoToMyTickets}
                      className='mt-4 inline-flex items-center justify-center rounded-full border border-transparent bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700 active:bg-pink-800 transition'
                    >
                      My tickets
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className='mt-4 text-center text-xs text-gray-400'>
            Keep this QR safe. Do not share it publicly.
          </p>
        </div>
      </Container>
    </section>
  )
}
