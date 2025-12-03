// src/pages/Events/EventDetailsPage.tsx
import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import eventsApi, { Event } from '../../apis/events.api'
import ticketsApi, { BookTicketResult } from '../../apis/tickets.api'
import { SuccessResponse } from '../../types/response.types'
import path from '../../constants/path'
import Popup from '../../components/Popup'

export default function EventDetailsPage() {
  const { event_id } = useParams<{ event_id: string }>()
  const navigate = useNavigate()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['event', event_id],
    enabled: !!event_id,
    queryFn: () => eventsApi.getEventDetails(event_id as string)
  })

  const ev: Event | undefined = data?.data.result

  const [popupOpen, setPopupOpen] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [lastResponse, setLastResponse] =
    useState<SuccessResponse<BookTicketResult> | null>(null)

  const [confirmOpen, setConfirmOpen] = useState(false)

  const bookTicketMutation = useMutation({
    mutationFn: async () => {
      const res = await ticketsApi.bookTicket(event_id as string)
      return res.data as SuccessResponse<BookTicketResult>
    },
    onSuccess: (res) => {
      setLastResponse(res) // LƯU FULL RESPONSE
      setPopupMessage('Book ticket successfully.')
      setPopupOpen(true)
    },
    onError: (err: any) => {
      console.error('Book ticket failed:', err)
      let msg = 'Failed to book ticket.'

      if (err?.response?.data?.message) msg = err.response.data.message
      if (err?.response?.data?.error) msg = err.response.data.error

      setLastResponse(null)
      setPopupMessage(msg)
      setPopupOpen(true)
    }
  })

  const handleClickBook = () => {
    if (!ev || !event_id) return
    setConfirmOpen(true)
  }

  const handleConfirmBook = () => {
    setConfirmOpen(false)
    bookTicketMutation.mutate()
  }

  const handleCancelBook = () => setConfirmOpen(false)

  const handlePopupClose = () => {
    setPopupOpen(false)

    // Chỉ navigate khi THÀNH CÔNG
    if (lastResponse && ev) {
      navigate(path.book_ticket, {
        state: {
          response: lastResponse, // FULL RESPONSE
          eventId: ev.id,
          eventTitle: ev.title
        }
      })
    }
  }

  const formatDate = (iso?: string) => {
    if (!iso) return 'TBA'
    return new Date(iso).toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const formatPrice = (cents?: number) => {
    if (!cents) return 'Free'
    return (cents / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    })
  }

  // Loading UI
  if (isLoading || !event_id) {
    return (
      <section id="event-details" className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-6 w-40 mb-4 bg-gray-800 rounded animate-pulse" />
          <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
            <div className="w-full h-56 bg-gray-800 animate-pulse" />
            <div className="p-5 space-y-3">
              <div className="h-4 w-32 bg-gray-800 rounded animate-pulse" />
              <div className="h-6 w-64 bg-gray-800 rounded animate-pulse" />
              <div className="h-3 w-48 bg-gray-800 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Error UI
  if (isError || !ev) {
    console.error('Error fetching event:', error)
    return (
      <section id="event-details" className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-300">
          Event not found or failed to load.
        </div>
      </section>
    )
  }

  return (
    <>
      <section id="event-details" className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="mb-4 text-sm text-gray-400">
            <Link to="/events" className="hover:underline">
              Events
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-100 font-medium">{ev.title}</span>
          </nav>

          {/* Cover */}
          <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
            <div className="relative">
              {ev.poster_url ? (
                <img
                  src={ev.poster_url}
                  className="w-full h-130 object-cover"
                  alt=""
                />
              ) : (
                <div className="w-full h-full bg-gray-800" />
              )}
            </div>

            <div className="p-5">
              <div className="text-xs text-pink-400 uppercase tracking-wide">
                {formatDate(ev.start_at)}
              </div>

              <h1 className="mt-1 text-2xl sm:text-3xl font-semibold">{ev.title}</h1>

              <div className="mt-1 text-sm text-gray-200 flex gap-2 flex-wrap">
                <span>{ev.location_text}</span>
                <span>•</span>
                <span>{formatPrice(ev.price_cents)}</span>
              </div>

              <div className="mt-4">
                <button
                  onClick={handleClickBook}
                  disabled={bookTicketMutation.isPending}
                  className="px-3 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-sm disabled:opacity-60"
                >
                  {bookTicketMutation.isPending ? 'Booking…' : 'Get tickets'}
                </button>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="mt-6">
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
              <h2 className="text-lg font-semibold">About this event</h2>
              <p className="mt-2 text-sm text-gray-300">{ev.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Confirm popup */}
      <ConfirmPopup
        open={confirmOpen}
        message={`Are you sure you want to book a ticket for "${ev.title}"?`}
        onConfirm={handleConfirmBook}
        onCancel={handleCancelBook}
      />

      {/* Result popup */}
      <Popup open={popupOpen} message={popupMessage} onClose={handlePopupClose} />
    </>
  )
}

interface ConfirmPopupProps {
  open: boolean
  message: string
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmPopup({ open, message, onConfirm, onCancel }: ConfirmPopupProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-[92%] max-w-sm">
        <h2 className="text-xl font-semibold text-center mb-4">Confirm booking</h2>

        <p className="text-sm text-gray-300 text-center">{message}</p>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl"
          >
            Yes, book
          </button>
        </div>
      </div>
    </div>
  )
}
