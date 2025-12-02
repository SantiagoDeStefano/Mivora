import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import path from '../../../constants/path'
import eventsApi from '../../../apis/events.api'

type EventDetails = {
  id: string
  organizer_id?: string
  title: string
  description?: string
  poster_url?: string | null
  location_text?: string
  start_at?: string
  end_at?: string
  price_cents?: number
  checked_in?: number
  capacity?: number
  status?: string
}

type Props = {
  event?: EventDetails | null
}

export default function CreatedEventDetailsPage({ event }: Props) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [ev, setEv] = useState<EventDetails | null>(event ?? null)
  const [loading, setLoading] = useState(!event)
  const [error, setError] = useState<string | null>(null)

  const [notification, setNotification] = useState<{
    text: string
    type: 'success' | 'error'
    visible: boolean
  }>({
    text: '',
    type: 'success',
    visible: false
  })

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type, visible: true })
    setTimeout(
      () => setNotification((prev) => ({ ...prev, visible: false })),
      3000
    )
  }

  const formatDate = (iso?: string) => {
    if (!iso) return 'TBA'
    const d = new Date(iso)
    return d.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const formatPrice = (cents?: number) => {
    if (!cents || cents <= 0) return 'Free'
    return `$${(cents / 100).toFixed(2)}`
  }

  // Toast
  const NotificationToast = () => {
    if (!notification.visible) return null
    return (
      <div
        className={`fixed right-4 top-6 z-50 rounded-md px-4 py-2 text-sm font-medium shadow-md ${
          notification.type === 'success'
            ? 'bg-emerald-600 text-white'
            : 'bg-red-600 text-white'
        }`}
      >
        {notification.text}
      </div>
    )
  }

  // Fetch event details nếu không có props.event
  useEffect(() => {
    if (event) return // đã có dữ liệu từ props

    if (!id) {
      setError('Missing event id.')
      setLoading(false)
      return
    }

    let cancelled = false

    const fetchDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await eventsApi.getCreatedEventDetails(id)
        const data = res.data.result

        if (cancelled) return

        const mapped: EventDetails = {
          id: data.id,
          organizer_id: (data as any).organizer_id,
          title: data.title,
          description: data.description,
          poster_url: data.poster_url,
          location_text: data.location_text,
          start_at: data.start_at,
          end_at: data.end_at,
          price_cents: data.price_cents,
          checked_in: data.checked_in,
          capacity: data.capacity,
          status: data.status
        }

        setEv(mapped)
      } catch (err) {
        console.error('Failed to load event details:', err)
        if (!cancelled) setError('Failed to load event details.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchDetails()

    return () => {
      cancelled = true
    }
  }, [id, event])

  // Loading skeleton
  if (loading) {
    return (
      <section id="event-details" className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-8 w-40 bg-gray-800 rounded-md animate-pulse mb-4" />
          <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
            <div className="aspect-[16/9] w-full bg-gray-800 animate-pulse" />
            <div className="p-5 space-y-3">
              <div className="h-4 w-24 bg-gray-800 rounded animate-pulse" />
              <div className="h-6 w-64 bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-40 bg-gray-800 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Error / not found
  if (error || !ev) {
    return (
      <section id="event-details" className="py-10 sm:py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-semibold text-gray-100 mb-2">
            Event not found
          </h1>
          <p className="text-sm text-gray-400 mb-4">
            {error || 'We could not find this event.'}
          </p>
          <button
            className="rounded-xl bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700"
            onClick={() => navigate(path.organizer_manage_event)}
          >
            Back to My Events
          </button>
        </div>
      </section>
    )
  }

  return (
    <section id="event-details" className="py-10 sm:py-14">
      <NotificationToast />
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm text-gray-400">
          <Link to={path.organizer_manage_event} className="hover:underline">
            My Events
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
                <div className="mt-1 text-sm text-gray-300 flex flex-wrap items-center gap-2">
                  <span>{ev.location_text}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {/* Publish & Update when draft */}
              {ev.status === 'draft' && (
                <>
                  <button
                    className="px-3 py-2 rounded-xl text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={() => {
                      if (ev.status !== 'draft') {
                        alert('Cannot publish: event must be in draft status.')
                        return
                      }
                      setEv((prev) =>
                        prev ? { ...prev, status: 'published' } : prev
                      )
                      const newUrl = path.organizer_publish_event.replace(
                        ':id',
                        ev.id
                      )
                      window.history.pushState({}, '', newUrl)
                      showNotification('Publish event successfully', 'success')
                    }}
                  >
                    Publish
                  </button>

                  <button
                    className="px-3 py-2 rounded-xl text-sm font-medium bg-yellow-600 text-white hover:bg-yellow-700"
                    onClick={() =>
                      navigate(
                        path.organizer_update_event.replace(':id', ev.id)
                      )
                    }
                  >
                    Update
                  </button>
                </>
              )}

              {/* Cancel when published */}
              {ev.status === 'published' && (
                <button
                  className="px-3 py-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700"
                  onClick={() => {
                    if (ev.status !== 'published') {
                      alert(
                        'Cannot cancel: event must be published to cancel.'
                      )
                      return
                    }
                    setEv((prev) =>
                      prev ? { ...prev, status: 'canceled' } : prev
                    )
                    const cancelUrl = path.organizer_cancel_event.replace(
                      ':id',
                      ev.id
                    )
                    window.history.pushState({}, '', cancelUrl)
                    showNotification('Cancel event successfully', 'success')
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3 items-start">
          {/* Left: About + Organizer */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900">
              <div className="p-5">
                <h2 className="text-lg font-semibold">About this event</h2>
                <p className="mt-2 text-sm text-gray-300">
                  {ev.description || 'No description provided.'}
                </p>
              </div>
            </div>

            {/* Organizer */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900">
              <div className="p-5">
                <h3 className="text-base font-semibold">Organizer</h3>
                <p className="mt-1 text-sm text-gray-300">
                  {ev.organizer_id || 'Unknown organizer'}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Details card */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-gray-800 bg-gray-900">
              <div className="p-5 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Status</span>
                  <span className="font-medium capitalize">
                    {ev.status || 'unknown'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Price</span>
                  <span className="font-medium">{formatPrice(ev.price_cents)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Start</span>
                  <span className="font-medium">{formatDate(ev.start_at)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">End</span>
                  <span className="font-medium">{formatDate(ev.end_at)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Location</span>
                  <span className="font-medium">{ev.location_text || '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Capacity</span>
                  <span className="font-medium">
                    {ev.capacity != null ? ev.capacity : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Checked in</span>
                  <span className="font-medium">{ev.checked_in ?? 0}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
