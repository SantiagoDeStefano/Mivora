import { useEffect, useState } from 'react'
import axios from 'axios'
import Button from '../../../components/Button'
import Container from '../../../components/Container/Container'
import Card from '../../../components/Card/Card'
import { useNavigate, useParams } from 'react-router-dom'
import eventsApi from '../../../apis/events.api'
import http from '../../../utils/http'
import path from '../../../constants/path'

export default function UpdateEventPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [locationText, setLocationText] = useState('')
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')
  const [price, setPrice] = useState('')
  const [capacity, setCapacity] = useState('')
  const [posterUrl, setPosterUrl] = useState('')
  const [status, setStatus] = useState<string | undefined>(undefined)

  const [uploadingPoster, setUploadingPoster] = useState(false)
  const [posterError, setPosterError] = useState<string | null>(null)

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string[] | null>(null)

  const inputBase =
    'mt-1 block w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 shadow-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500'

  const labelBase = 'block text-sm font-medium text-gray-300'

  const fieldLabelMap: Record<string, string> = {
    title: 'Title',
    description: 'Description',
    poster_url: 'Poster image',
    location_text: 'Location',
    start_at: 'Start time',
    end_at: 'End time',
    price_cents: 'Price',
    capacity: 'Capacity',
    status: 'Status'
  }

  // Load event details
  useEffect(() => {
    if (!id) {
      setError(['Missing event id.'])
      setLoading(false)
      return
    }

    let cancelled = false

    const fetchEvent = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await eventsApi.getCreatedEventDetails(id)
        const data = res.data.result

        if (cancelled) return

        setTitle(data.title ?? '')
        setDescription(data.description ?? '')
        setLocationText(data.location_text ?? '')
        setPosterUrl(data.poster_url ?? '')

        setStartAt(
          data.start_at ? new Date(data.start_at).toISOString().slice(0, 16) : ''
        )
        setEndAt(
          data.end_at ? new Date(data.end_at).toISOString().slice(0, 16) : ''
        )

        setPrice(
          typeof data.price_cents === 'number'
            ? String(data.price_cents / 100)
            : ''
        )
        setCapacity(
          typeof data.capacity === 'number' ? String(data.capacity) : ''
        )

        setStatus(data.status ?? 'draft')
      } catch (err) {
        console.error('Failed to load event details:', err)
        if (!cancelled) setError(['Failed to load event details.'])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchEvent()

    return () => {
      cancelled = true
    }
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    const messages: string[] = []

    const titleTrimmed = title.trim()
    if (!titleTrimmed) {
      messages.push('Title is required.')
    } else {
      if (titleTrimmed.length < 3) {
        messages.push('Title must be at least 3 characters')
      }
      if (titleTrimmed.length > 120) {
        messages.push('Title must be at most 120 characters')
      }
    }

    const descriptionTrimmed = description.trim()
    const locationTrimmed = locationText.trim()

    // Bạn có thể cho phép location trống, nhưng đa số event cần địa điểm
    if (!locationTrimmed) {
      messages.push('Location is required.')
    }

    // Thời gian: schema chỉ yêu cầu date, nhưng UX hợp lý hơn là bắt buộc và end > start
    if (!startAt || !endAt) {
      messages.push('Start and end time are required.')
    } else {
      const start = new Date(startAt)
      const end = new Date(endAt)
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        messages.push('Invalid date/time.')
      } else if (end <= start) {
        messages.push('End time must be after start time.')
      }
    }

    let priceNumber: number | undefined
    if (price !== '') {
      const n = Number(price)
      if (isNaN(n)) {
        messages.push('Price must be a number.')
      } else if (n < 0) {
        // đúng message trong schema
        messages.push('Price must be non-negative')
      } else {
        priceNumber = n
      }
    }

    let capacityNumber: number | undefined
    if (capacity !== '') {
      const n = Number(capacity)
      if (isNaN(n)) {
        messages.push('Capacity must be a number.')
      } else if (n < 0) {
        // đúng message trong schema
        messages.push('Capacity must be non-negative')
      } else {
        capacityNumber = n
      }
    }

    if (messages.length > 0) {
      setError(messages)
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const payload: any = {
        title: titleTrimmed,
        // description/location/poster_url: trim theo schema, nhưng không bắt buộc
        ...(descriptionTrimmed && { description: descriptionTrimmed }),
        ...(locationTrimmed && { location_text: locationTrimmed }),
        ...(posterUrl && { poster_url: posterUrl })
      }

      if (startAt) {
        const start = new Date(startAt)
        payload.start_at = start.toISOString()
      }
      if (endAt) {
        const end = new Date(endAt)
        payload.end_at = end.toISOString()
      }

      if (typeof priceNumber === 'number') {
        payload.price_cents = Math.round(priceNumber * 100)
      }

      if (typeof capacityNumber === 'number') {
        payload.capacity = capacityNumber
      }

      if (status) {
        payload.status = status
      }

      console.log('Update event payload:', payload)

      const res = await eventsApi.updateEvent(id, payload)

      if (res?.data?.result) {
        console.log('Event updated:', res.data.result)
        navigate(path.organizer_created_event_details.replace(':id', id))
      } else {
        console.warn('Update event: unexpected response shape', res)
        setError(['Event updated, but response was unexpected.'])
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const statusCode = err.response?.status
        const data = err.response?.data as any

        console.error('Update event failed:', {
          status: statusCode,
          data
        })

        let messages: string[] = []

        const rawErrors =
          (data && (data.errors || data.error || data.validationErrors)) || null

        if (rawErrors && typeof rawErrors === 'object') {
          for (const [field, value] of Object.entries(rawErrors)) {
            const label = fieldLabelMap[field] || field
            const text = Array.isArray(value)
              ? value.join(', ')
              : typeof value === 'string'
              ? value
              : JSON.stringify(value)
            messages.push(`${label}: ${text}`)
          }
        }

        const fallback =
          (data && (data.message || data.error || data.detail)) ||
          'Unknown error'

        if (!messages.length) {
          messages.push(fallback)
        }

        setError(messages)
      } else {
        console.error('Update event failed (non-axios):', err)
        setError(['Unknown error.'])
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <header className="mb-8 max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold text-gray-100">Update Event</h2>
          <p className="mt-1 text-sm text-gray-400">
            Edit your event details and save the changes.
          </p>
        </header>

        <Card className="bg-gray-950 border-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl max-w-2xl mx-auto">
          {loading ? (
            <div className="space-y-4">
              <div className="h-6 w-40 bg-gray-800 rounded-md animate-pulse" />
              <div className="h-10 w-full bg-gray-800 rounded-md animate-pulse" />
              <div className="h-24 w-full bg-gray-800 rounded-md animate-pulse" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error block */}
              {error && (
                <div className="mb-2 rounded-lg border border-red-700 bg-red-900/40 p-3 text-red-300 text-sm space-y-1">
                  {error.map((msg, i) => (
                    <div key={i}>• {msg}</div>
                  ))}
                </div>
              )}

              {/* Title */}
              <div>
                <label htmlFor="title" className={labelBase}>
                  Event Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputBase}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className={labelBase}>
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className={inputBase + ' resize-none'}
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className={labelBase}>
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  className={inputBase}
                />
              </div>

              {/* Poster upload */}
              <div>
                <label htmlFor="poster" className={labelBase}>
                  Poster Image
                </label>
                <input
                  type="file"
                  id="poster"
                  accept="image/*"
                  className="mt-1 block w-full text-sm text-gray-300"
                  onChange={async (ev) => {
                    const file = ev.target.files && ev.target.files[0]
                    setPosterError(null)
                    if (!file) return

                    const form = new FormData()
                    form.append('image', file)

                    try {
                      setUploadingPoster(true)
                      const res = await http.post('/medias/image', form, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                      })
                      const result = res?.data?.result

                      if (Array.isArray(result) && result[0]?.url) {
                        setPosterUrl(result[0].url)
                      } else if (result?.url) {
                        setPosterUrl(result.url)
                      } else {
                        setPosterError('Upload failed: unexpected response')
                      }
                    } catch (err: any) {
                      console.error('Poster upload error', err)
                      setPosterError(err?.message || 'Upload failed')
                    } finally {
                      setUploadingPoster(false)
                    }
                  }}
                />

                {uploadingPoster && (
                  <div className="mt-2 text-xs text-gray-400">
                    Uploading poster…
                  </div>
                )}
                {posterError && (
                  <div className="mt-2 text-xs text-red-500">{posterError}</div>
                )}
                {posterUrl && (
                  <div className="mt-3">
                    <img
                      src={posterUrl}
                      alt="poster"
                      className="h-40 w-full rounded-xl object-cover border border-gray-800"
                    />
                  </div>
                )}
              </div>

              {/* Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startAt" className={labelBase}>
                    Start at
                  </label>
                  <input
                    type="datetime-local"
                    id="startAt"
                    value={startAt}
                    onChange={(e) => setStartAt(e.target.value)}
                    className={inputBase}
                  />
                </div>

                <div>
                  <label htmlFor="endAt" className={labelBase}>
                    End at
                  </label>
                  <input
                    type="datetime-local"
                    id="endAt"
                    value={endAt}
                    onChange={(e) => setEndAt(e.target.value)}
                    className={inputBase}
                  />
                </div>
              </div>

              {/* Price + Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className={labelBase}>
                    Price (currency)
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="e.g. 15.00"
                    className={inputBase}
                  />
                </div>

                <div>
                  <label htmlFor="capacity" className={labelBase}>
                    Capacity
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    min="0"
                    className={inputBase}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-pink-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-pink-700 focus:ring-2 focus:ring-pink-500"
                >
                  {submitting ? 'Updating…' : 'Update Event'}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </Container>
    </section>
  )
}
