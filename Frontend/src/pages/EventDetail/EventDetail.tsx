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
      setLastResponse(res)
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
    if (lastResponse && ev) {
      navigate(path.book_ticket, {
        state: {
          response: lastResponse,
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
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm text-gray-400">
          <Link to="/events" className="hover:underline">
            Events
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-100 font-medium">{ev.title}</span>
        </nav>

        {/* Header / Cover */}
        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
          <div className="relative">
            {ev.poster_url ? (
              <img
                src={ev.poster_url}
                alt={`${ev.title} poster`}
                className="aspect-[16/9] w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="aspect-[16/9] w-full bg-gradient-to-br from-gray-800 to-gray-900" />
            )}
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-pink-400">
                  {formatDate(ev.start_at)}
                </div>

                <h1 className="mt-1 text-2xl sm:text-3xl font-semibold">
                  {ev.title}
                </h1>

                {/* Action */}
                <div className="mt-4">
                  <button
                    onClick={handleClickBook}
                    disabled={bookTicketMutation.isPending}
                    className="px-3 py-2 rounded-xl text-sm font-medium bg-pink-600 text-white hover:bg-pink-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {bookTicketMutation.isPending ? "Booking…" : "Get tickets"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3 items-start">
          {/* About */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-gray-800 bg-gray-900">
              <div className="p-5">
                <h2 className="text-lg font-semibold">About this event</h2>
                <p className="mt-2 text-sm text-gray-300">
                  {ev.description}
                </p>
              </div>
            </div>
          </div>

          {/* Details card: organizer, date, price, location, capacity */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-gray-800 bg-gray-900">
              <div className="p-5 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Organizer</span>
                  <span className="font-medium">
                    {ev.organizer_name || "Unknown organizer"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Date</span>
                  <span className="font-medium">
                    {formatDate(ev.start_at)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Price</span>
                  <span className="font-medium">
                    {formatPrice(ev.price_cents)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Location</span>
                  <span className="font-medium">
                    {ev.location_text || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Capacity</span>
                  <span className="font-medium">
                    {ev.capacity != null ? `${ev.capacity} seats` : "—"}
                  </span>
                </div>
              </div>
            </div>
          </aside>
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

interface ConfirmPopupProps {
  open: boolean
  message: string
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmPopup({ open, message, onConfirm, onCancel }: ConfirmPopupProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-[92%] max-w-sm rounded-2xl border border-gray-800 bg-gray-900 p-6">
        <h2 className="mb-4 text-xl font-semibold text-center">
          Confirm booking
        </h2>

        <p className="text-sm text-gray-300 text-center">{message}</p>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-3 rounded-xl bg-gray-700 text-white hover:bg-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-6 py-3 rounded-xl bg-pink-600 text-white hover:bg-pink-700"
          >
            Yes, book
          </button>
        </div>
      </div>
    </div>
  )
}
}