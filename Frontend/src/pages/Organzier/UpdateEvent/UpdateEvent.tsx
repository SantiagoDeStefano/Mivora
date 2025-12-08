import { useEffect, useState } from 'react'
import axios from 'axios'
import * as yup from 'yup'
import Button from '../../../components/Button'
import Container from '../../../components/Container/Container'
import Card from '../../../components/Card/Card'
import { useNavigate, useParams } from 'react-router-dom'
import eventsApi from '../../../apis/events.api'
import path from '../../../constants/path'
import usersApi from '../../../apis/users.api'
import {
  updateEvent,
  updateEventPoster,
  UpdateEventSchema,
  UpdateEventPosterSchema
} from '../../../utils/rules'

export default function UpdateEventPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [locationText, setLocationText] = useState('')
  const [startAt, setStartAt] = useState('') // 'YYYY-MM-DDTHH:mm'
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
    status: 'Status',
    image: 'Poster image'
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

        const res = await usersApi.getCreatedEventDetails(id)
        const data = res.data.result

        if (cancelled) return

        setTitle(data.title ?? '')
        setDescription(data.description ?? '')
        setLocationText(data.location_text ?? '')
        setPosterUrl(data.poster_url ?? '')

        // convert ISO -> 'YYYY-MM-DDTHH:mm' cho datetime-local
        setStartAt(
          data.start_at
            ? new Date(data.start_at).toISOString().slice(0, 16)
            : ''
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

  const buildUpdatePayload = (): UpdateEventSchema & { status?: string } => {
    const payload: any = {}

    const titleTrimmed = title.trim()
    if (titleTrimmed !== '') {
      payload.title = titleTrimmed
    }

    const descriptionTrimmed = description.trim()
    if (descriptionTrimmed !== '') {
      payload.description = descriptionTrimmed
    }

    const locationTrimmed = locationText.trim()
    if (locationTrimmed !== '') {
      payload.location_text = locationTrimmed
    }

    if (posterUrl.trim() !== '') {
      payload.poster_url = posterUrl.trim()
    }

    // convert từ 'YYYY-MM-DDTHH:mm' -> ISO string cho API
    if (startAt) {
      const d = new Date(startAt)
      payload.start_at = d.toISOString()
    }

    if (endAt) {
      const d = new Date(endAt)
      payload.end_at = d.toISOString()
    }

    const priceTrimmed = price.trim()
    if (priceTrimmed !== '') {
      const priceNumber = Number(priceTrimmed)
      payload.price_cents = Number.isNaN(priceNumber)
        ? NaN
        : Math.round(priceNumber * 100)
    }

    const capacityTrimmed = capacity.trim()
    if (capacityTrimmed !== '') {
      payload.capacity = Number(capacityTrimmed)
    }

    if (status) {
      payload.status = status
    }

    return payload
  }

  const mapYupErrorsToMessages = (err: yup.ValidationError): string[] => {
    const messages: string[] = []

    if (err.inner && err.inner.length > 0) {
      err.inner.forEach((e) => {
        if (!e.path) {
          messages.push(e.message)
          return
        }

        const label = fieldLabelMap[e.path] || e.path
        messages.push(`${label}: ${e.message}`)
      })
    } else if (err.message) {
      messages.push(err.message)
    }

    return messages
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    setError(null)

    const payload = buildUpdatePayload()

    try {
      const validated = await updateEvent.validate(payload, {
        abortEarly: false,
        stripUnknown: true
      })

      const apiPayload = validated

      setSubmitting(true)

      try {
        const res = await eventsApi.updateEvent(id, apiPayload)

        if (res?.data?.result) {
          console.log('Event updated:', res.data.result)
          navigate(path.organizer_created_event_details.replace(':id', id))
        } else {
          console.warn('Update event: unexpected response shape', res)
          setError(['Event updated, but response was unexpected.'])
        }
      } catch (apiErr) {
        if (axios.isAxiosError(apiErr)) {
          const statusCode = apiErr.response?.status
          const data = apiErr.response?.data as any

          console.error('Update event failed:', {
            status: statusCode,
            data
          })

          const messages: string[] = []

          const rawErrors =
            (data && (data.errors || data.error || data.validationErrors)) ||
            null

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
          console.error('Update event failed (non-axios):', apiErr)
          setError(['Unknown error.'])
        }
      } finally {
        setSubmitting(false)
      }
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const messages = mapYupErrorsToMessages(err)
        setError(messages)
        return
      }

      console.error('Unexpected validation error:', err)
      setError(['Validation failed.'])
    }
  }

  const handlePosterChange = async (
    ev: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!id) {
      setPosterError('Missing event id.')
      return
    }

    const file = ev.target.files?.[0] ?? null
    setPosterError(null)

    if (!file) {
      setPosterError('Image is required')
      return
    }

    const payload: UpdateEventPosterSchema = { image: file as any }

    try {
      await updateEventPoster.validate(payload, {
        abortEarly: false,
        stripUnknown: true
      })
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const message =
          err.inner.map((e) => e.message).filter(Boolean).join(' | ') ||
          err.message
        setPosterError(message)
        return
      }

      console.error('Unexpected poster validation error', err)
      setPosterError('Upload failed')
      return
    }

    try {
      setUploadingPoster(true)

      const formData = new FormData()
      // key 'image' phải khớp backend
      formData.append('image', file)

      // NOTE: eventsApi.uploadEventPoster phải có dạng (eventId, formData) và dùng PUT
      const res = await eventsApi.uploadEventPoster(id, formData)
      const result: any = res?.data?.result

      // Tùy backend, nó có thể trả { poster_url } hoặc cả Event
      const newUrl =
        result?.poster_url ??
        result?.url ??
        (Array.isArray(result) && result[0]?.url)

      if (typeof newUrl === 'string' && newUrl.trim() !== '') {
        setPosterUrl(newUrl)
      } else {
        console.warn('Upload poster: unexpected response', res.data)
        setPosterError('Upload failed: unexpected response')
      }
    } catch (err: any) {
      console.error('Poster upload error', err)
      if (axios.isAxiosError(err)) {
        setPosterError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            'Upload failed'
        )
      } else {
        setPosterError(err?.message || 'Upload failed')
      }
    } finally {
      setUploadingPoster(false)
    }
  }

  return (
    <section className='py-10 sm:py-14'>
      <Container>
        <header className='mb-8 max-w-2xl mx-auto'>
          <h2 className='text-3xl font-semibold text-gray-100'>Update Event</h2>
          <p className='mt-1 text-sm text-gray-400'>
            Edit your event details and save the changes.
          </p>
        </header>

        <Card className='bg-gray-950 border-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl max-w-2xl mx-auto'>
          {loading ? (
            <div className='space-y-4'>
              <div className='h-6 w-40 bg-gray-800 rounded-md animate-pulse' />
              <div className='h-10 w-full bg-gray-800 rounded-md animate-pulse' />
              <div className='h-24 w-full bg-gray-800 rounded-md animate-pulse' />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-6'>
              {error && (
                <div className='mb-2 rounded-lg border border-red-700 bg-red-900/40 p-3 text-red-300 text-sm space-y-1'>
                  {error.map((msg, i) => (
                    <div key={i}>• {msg}</div>
                  ))}
                </div>
              )}

              <div>
                <label htmlFor='title' className={labelBase}>
                  Event Title
                </label>
                <input
                  type='text'
                  id='title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputBase}
                />
              </div>

              <div>
                <label htmlFor='description' className={labelBase}>
                  Description
                </label>
                <textarea
                  id='description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className={inputBase + ' resize-none'}
                />
              </div>

              <div>
                <label htmlFor='location' className={labelBase}>
                  Location
                </label>
                <input
                  type='text'
                  id='location'
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  className={inputBase}
                />
              </div>

              <div>
                <label htmlFor='poster' className={labelBase}>
                  Poster Image
                </label>
                <input
                  type='file'
                  id='poster'
                  accept='image/*'
                  className='mt-1 block w-full text-sm text-gray-300'
                  onChange={handlePosterChange}
                />

                {uploadingPoster && (
                  <div className='mt-2 text-xs text-gray-400'>
                    Uploading poster…
                  </div>
                )}
                {posterError && (
                  <div className='mt-2 text-xs text-red-500'>
                    {posterError}
                  </div>
                )}
                {posterUrl && (
                  <div className='mt-3'>
                    <img
                      src={posterUrl}
                      alt='poster'
                      className='h-40 w-full rounded-xl object-cover border border-gray-800'
                    />
                  </div>
                )}
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label htmlFor='startAt' className={labelBase}>
                    Start at
                  </label>
                  <input
                    type='datetime-local'
                    id='startAt'
                    value={startAt}
                    onChange={(e) => setStartAt(e.target.value)}
                    className={inputBase}
                  />
                </div>

                <div>
                  <label htmlFor='endAt' className={labelBase}>
                    End at
                  </label>
                  <input
                    type='datetime-local'
                    id='endAt'
                    value={endAt}
                    onChange={(e) => setEndAt(e.target.value)}
                    className={inputBase}
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label htmlFor='price' className={labelBase}>
                    Price (currency)
                  </label>
                  <input
                    type='number'
                    id='price'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min='0'
                    step='0.01'
                    placeholder='e.g. 15.00'
                    className={inputBase}
                  />
                </div>

                <div>
                  <label htmlFor='capacity' className={labelBase}>
                    Capacity
                  </label>
                  <input
                    type='number'
                    id='capacity'
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    min='0'
                    className={inputBase}
                  />
                </div>
              </div>

              <div className='flex justify-end pt-2'>
                <Button
                  type='submit'
                  disabled={submitting}
                  className='rounded-xl bg-pink-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-pink-700 focus:ring-2 focus:ring-pink-500'
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
