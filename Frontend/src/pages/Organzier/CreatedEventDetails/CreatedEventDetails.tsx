import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import path from '../../../constants/path'
import eventsApi from '../../../apis/events.api'
import usersApi from '../../../apis/users.api'

type EventStatus = 'draft' | 'published' | 'canceled'

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
  status?: EventStatus
  revenue_cents?: number | string
}

export default function CreatedEventDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [ev, setEv] = useState<EventDetails | null>(null)
  const [loading, setLoading] = useState(true)
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

  const [publishing, setPublishing] = useState(false)
  const [canceling, setCanceling] = useState(false)
  const [settingDraft, setSettingDraft] = useState(false)

  const [confirmPublish, setConfirmPublish] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)

  const showNotification = (
    text: string,
    type: 'success' | 'error' = 'success'
  ) => {
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
    if (!cents || +cents <= 0) return 'Free'
    return `$${(Number(cents) / 100).toFixed(2)}`
  }

  const formatRevenue = (cents?: number | string) => {
    const n = Number(cents ?? 0)
    if (!n || n <= 0) return '$0.00'
    return `$${(n / 100).toFixed(2)}`
  }

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

  const ConfirmPopup = ({
    open,
    title,
    message,
    onConfirm,
    onCancel
  }: {
    open: boolean
    title: string
    message: string
    onConfirm: () => void
    onCancel: () => void
  }) => {
    if (!open) return null
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
        <div className='w-full max-w-sm rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-xl'>
          <h2 className='text-lg font-semibold text-gray-100'>{title}</h2>
          <p className='mt-2 text-sm text-gray-400'>{message}</p>
          <div className='mt-5 flex items-center justify-end gap-3'>
            <button
              className='rounded-xl px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800'
              onClick={onCancel}
              type='button'
            >
              Cancel
            </button>
            <button
              className='rounded-xl bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700'
              onClick={onConfirm}
              type='button'
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ALWAYS fetch event details by id
  useEffect(() => {
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

        const res = await usersApi.getCreatedEventDetails(id)
        const data = res.data.result

        console.log('raw event detail:', data)

        const mapped: EventDetails = {
          id: data.id,
          organizer_id: (data as any).organizer_id,
          title: data.title,
          description: data.description,
          poster_url: data.poster_url ?? null,
          location_text: data.location_text,
          start_at: data.start_at,
          end_at: data.end_at,
          price_cents: data.price_cents,
          checked_in: data.checked_in,
          capacity: data.capacity,
          status: data.status as EventStatus,
          revenue_cents: data.revenue_cents
        }

        console.log('mapped event:', mapped)

        if (!cancelled) setEv(mapped)
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
  }, [id])

  // Loading skeleton
  if (loading) {
    return (
      <section id='event-details' className='py-10 sm:py-14'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='h-8 w-40 bg-gray-800 rounded-md animate-pulse mb-4' />
          <div className='overflow-hidden rounded-2xl border border-gray-800 bg-gray-900'>
            <div className='aspect-[16/9] w-full bg-gray-800 animate-pulse' />
            <div className='p-5 space-y-3'>
              <div className='h-4 w-24 bg-gray-800 rounded animate-pulse' />
              <div className='h-6 w-64 bg-gray-800 rounded animate-pulse' />
              <div className='h-4 w-40 bg-gray-800 rounded animate-pulse' />
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Error / not found
  if (error || !ev) {
    return (
      <section id='event-details' className='py-10 sm:py-14'>
        <div className='max-w-3xl mx-auto px-4 text-center'>
          <h1 className='text-2xl font-semibold text-gray-100 mb-2'>
            Event not found
          </h1>
          <p className='text-sm text-gray-400 mb-4'>
            {error || 'We could not find this event.'}
          </p>
          <button
            className='rounded-xl bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700'
            onClick={() => navigate(path.organizer_manage_event)}
            type='button'
          >
            Back to My Events
          </button>
        </div>
      </section>
    )
  }

  console.log('rendering event with poster_url:', ev.poster_url)

  return (
    <section id='event-details' className='py-10 sm:py-14'>
      <NotificationToast />

      {/* Confirm popups */}
      <ConfirmPopup
        open={confirmPublish}
        title='Publish Event'
        message='Are you sure you want to publish this event?'
        onCancel={() => setConfirmPublish(false)}
        onConfirm={async () => {
          setConfirmPublish(false)

          if (ev.status !== 'draft') {
            showNotification(
              'Cannot publish: event must be in draft status.',
              'error'
            )
            return
          }

          try {
            setPublishing(true)
            const res = await eventsApi.publishEvent(ev.id)
            const updated = res.data.result
            setEv((prev) => (prev ? { ...prev, ...updated } : updated))
            showNotification('Publish event successfully', 'success')
          } catch (err) {
            const msg = axios.isAxiosError(err)
              ? err.response?.data?.message ||
                err.response?.data?.error ||
                'Failed to publish event.'
              : 'Failed to publish event.'
            console.error('Publish event failed:', err)
            showNotification(msg, 'error')
          } finally {
            setPublishing(false)
          }
        }}
      />

      <ConfirmPopup
        open={confirmCancel}
        title='Cancel Event'
        message='Are you sure you want to cancel this event? This action cannot be undone.'
        onCancel={() => setConfirmCancel(false)}
        onConfirm={async () => {
          setConfirmCancel(false)

          if (ev.status !== 'published') {
            showNotification(
              'Cannot cancel: event must be published to cancel.',
              'error'
            )
            return
          }

          try {
            setCanceling(true)
            const res = await eventsApi.cancelEvent(ev.id)
            const updated = res.data.result
            setEv((prev) => (prev ? { ...prev, ...updated } : updated))
            showNotification('Cancel event successfully', 'success')
          } catch (err) {
            const msg = axios.isAxiosError(err)
              ? err.response?.data?.message ||
                err.response?.data?.error ||
                'Failed to cancel event.'
              : 'Failed to cancel event.'
            console.error('Cancel event failed:', err)
            showNotification(msg, 'error')
          } finally {
            setCanceling(false)
          }
        }}
      />

      <div className='max-w-7xl mx-auto px-4'>
        {/* Breadcrumb */}
        <nav className='mb-4 text-sm text-gray-400'>
          <Link to={path.organizer_manage_event} className='hover:underline'>
            My Events
          </Link>
          <span className='mx-2'>/</span>
          <span className='text-gray-100 font-medium'>{ev.title}</span>
        </nav>

        {/* Header / poster + revenue */}
        <div className='relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900'>
          <div className='relative w-full aspect-video overflow-hidden rounded-xl'>
            {ev.poster_url ? (
              <img
                src={ev.poster_url}
                alt={`${ev.title} poster`}
                className='absolute inset-0 w-full h-full object-coverr'
                loading='lazy'
              />
            ) : (
              <div className='aspect-[16/9] w-full bg-gradient-to-br from-gray-800 to-gray-900' />
            )}

            <div className='absolute top-4 right-4 z-20 rounded-xl border border-emerald-500/60 bg-emerald-900/50 backdrop-blur-md px-4 py-3 shadow-lg'>
              <p className='text-emerald-300 font-semibold text-[11px] uppercase tracking-wide'>
                Revenue
              </p>
              <p className='text-2xl sm:text-3xl font-bold text-emerald-100'>
                {formatRevenue(ev.revenue_cents)}
              </p>
            </div>
          </div>

          <div className='p-5'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <div className='text-xs font-medium uppercase tracking-wide text-pink-400'>
                  {formatDate(ev.start_at)}
                </div>
                <h1 className='mt-1 text-2xl sm:text-3xl font-semibold'>
                  {ev.title}
                </h1>
                <div className='mt-1 text-sm text-gray-300 flex flex-wrap items-center gap-2'>
                  <span>{ev.location_text}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className='mt-4 flex flex-wrap items-center gap-2'>
              {ev.status === 'draft' && (
                <>
                  <button
                    type='button'
                    disabled={publishing}
                    className='px-3 py-2 rounded-xl text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed'
                    onClick={() => setConfirmPublish(true)}
                  >
                    {publishing ? 'Publishing…' : 'Publish'}
                  </button>

                  <button
                    type='button'
                    className='px-3 py-2 rounded-xl text-sm font-medium bg-yellow-600 text-white hover:bg-yellow-700'
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

              {ev.status === 'published' && (
                <button
                  type='button'
                  disabled={canceling}
                  className='px-3 py-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed'
                  onClick={() => setConfirmCancel(true)}
                >
                  {canceling ? 'Canceling…' : 'Cancel'}
                </button>
              )}

              {ev.status === 'canceled' && (
                <button
                  type='button'
                  disabled={settingDraft}
                  className='px-3 py-2 rounded-xl text-sm font-medium bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-60 disabled:cursor-not-allowed'
                  onClick={async () => {
                    try {
                      setSettingDraft(true)
                      const res = await eventsApi.draftEvent(ev.id)
                      const updated = res.data.result
                      setEv((prev) =>
                        prev ? { ...prev, ...updated } : updated
                      )
                      showNotification('Set draft successfully', 'success')
                    } catch (err) {
                      const msg = axios.isAxiosError(err)
                        ? err.response?.data?.message ||
                          err.response?.data?.error ||
                          'Failed to set draft.'
                        : 'Failed to set draft.'
                      console.error('Set draft failed:', err)
                      showNotification(msg, 'error')
                    } finally {
                      setSettingDraft(false)
                    }
                  }}
                >
                  {settingDraft ? 'Updating…' : 'Set draft'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content grid */}
        <div className='mt-6 grid gap-6 lg:grid-cols-3 items-start'>
          {/* Left: About */}
          <div className='lg:col-span-2 space-y-6'>
            <div className='rounded-2xl border border-gray-800 bg-gray-900'>
              <div className='p-5'>
                <h2 className='text-lg font-semibold'>About this event</h2>
                <p className='mt-2 text-sm text-gray-300'>
                  {ev.description || 'No description provided.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Details card */}
          <aside className='space-y-6'>
            <div className='rounded-2xl border border-gray-800 bg-gray-900'>
              <div className='p-5 space-y-3 text-sm'>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-300'>Status</span>
                  <span className='font-medium capitalize'>
                    {ev.status || 'unknown'}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-300'>Price</span>
                  <span className='font-medium'>
                    {formatPrice(ev.price_cents)}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-300'>Start</span>
                  <span className='font-medium'>{formatDate(ev.start_at)}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-300'>End</span>
                  <span className='font-medium'>{formatDate(ev.end_at)}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-300'>Location</span>
                  <span className='font-medium'>
                    {ev.location_text || '—'}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-300'>Capacity</span>
                  <span className='font-medium'>
                    {ev.capacity != null ? ev.capacity : '—'}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-300'>Checked in</span>
                  <span className='font-medium'>{ev.checked_in ?? 0}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
