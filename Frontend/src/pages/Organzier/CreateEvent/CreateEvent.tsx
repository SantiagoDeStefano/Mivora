import { useState } from 'react'
import axios from 'axios'
import * as yup from 'yup'
import Button from '../../../components/Button'
import Container from '../../../components/Container/Container'
import Card from '../../../components/Card/Card'
import { useNavigate } from 'react-router-dom'
import eventsApi from '../../../apis/events.api'
import path from '../../../constants/path'
import {
  createEvent,
  uploadEventPoster,
  CreateEventSchema,
  UploadEventPosterSchema
} from '../../../utils/rules'

type EventFormErrors = Partial<
  Record<
    | 'title'
    | 'description'
    | 'poster_url'
    | 'location_text'
    | 'start_at'
    | 'end_at'
    | 'price_cents'
    | 'capacity'
    | 'image',
    string
  >
>

export default function CreateEventPage() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [locationText, setLocationText] = useState('')
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')
  const [price, setPrice] = useState('') // UI: "15.00" → price_cents
  const [capacity, setCapacity] = useState('')

  // Poster: file + preview (KHÔNG upload trước)
  const [posterFile, setPosterFile] = useState<File | null>(null)
  const [posterPreview, setPosterPreview] = useState('')

  const [uploadingPoster, setUploadingPoster] = useState(false) // dùng khi upload sau create
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<EventFormErrors>({})

  const inputBase =
    'mt-1 block w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 shadow-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500'

  const labelBase = 'block text-sm font-medium text-gray-300'

  const setError = (field: keyof EventFormErrors, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }))
  }

  const clearError = (field: keyof EventFormErrors) => {
    setErrors((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [field]: _removed, ...rest } = prev
      return rest
    })
  }

  const buildPayload = (): CreateEventSchema => {
    const rawPrice = price.trim()
    const rawCapacity = capacity.trim()

    const startDate = startAt ? new Date(startAt).toISOString() : undefined
    const endDate = endAt ? new Date(endAt).toISOString() : undefined

    let priceCents: number | undefined
    if (rawPrice !== '') {
      const num = Number(rawPrice)
      priceCents = Number.isFinite(num) ? Math.round(num * 100) : undefined
    }

    let capacityNumber: number | undefined
    if (rawCapacity !== '') {
      const num = Number(rawCapacity)
      capacityNumber = Number.isFinite(num) ? num : undefined
    }

    const payload: CreateEventSchema = {
      title: title.trim(),
      description: description.trim(),
      // poster_url: không set ở bước create, backend sẽ update qua /events/:id/poster
      poster_url: undefined,
      location_text: locationText.trim(),
      start_at: startDate,
      end_at: endDate,
      price_cents: priceCents as any,
      capacity: capacityNumber as any
    }

    return payload
  }

  const mapYupErrors = (err: yup.ValidationError) => {
    const formErrors: EventFormErrors = {}

    err.inner.forEach((e) => {
      if (!e.path) return
      const field = e.path as keyof EventFormErrors
      if (!formErrors[field]) {
        formErrors[field] = e.message
      }
    })

    setErrors(formErrors)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const payload = buildPayload()

    try {
      const validatedPayload = await createEvent.validate(payload, {
        abortEarly: false,
        stripUnknown: true
      })

      setSubmitting(true)

      try {
        // 1. Tạo event
        const res = await eventsApi.createEvent(validatedPayload as any)
        // BACKEND: { message, result: { id, ... } }
        const createdEvent = res.data.result

        if (!createdEvent || !createdEvent.id) {
          console.warn('Create event: unexpected response shape', res)
          alert('Event created, but response was unexpected.')
          return
        }

        console.log('Event created:', createdEvent)

        // 2. Nếu có posterFile thì upload gắn với event_id
        if (posterFile) {
          try {
            setUploadingPoster(true)

            const formData = new FormData()
            // key 'image' phải match backend
            formData.append('image', posterFile)

            // eventsApi.uploadEventPoster(eventId, formData)
            const uploadRes = await eventsApi.uploadEventPoster(
              createdEvent.id,
              formData
            )
            console.log('Poster upload response:', uploadRes.data)
          } catch (uploadErr) {
            console.error('Upload poster after create failed:', uploadErr)
            alert('Event created, but poster upload failed. Check console.')
          } finally {
            setUploadingPoster(false)
          }
        }

        // 3. Điều hướng sau khi xong
        navigate(path.organizer_manage_event)
      } catch (apiErr) {
        if (axios.isAxiosError(apiErr)) {
          console.error('Create event failed:', {
            status: apiErr.response?.status,
            data: apiErr.response?.data
          })

          const data: any = apiErr.response?.data
          const serverErrors = data?.errors

          if (serverErrors && typeof serverErrors === 'object') {
            const mapped: EventFormErrors = {}

            Object.entries(serverErrors).forEach(([field, value]) => {
              if (typeof value === 'string') {
                mapped[field as keyof EventFormErrors] = value
              } else if (value && typeof value === 'object' && 'msg' in value) {
                mapped[field as keyof EventFormErrors] = (value as any).msg
              }
            })

            setErrors(mapped)
          } else {
            alert('Create failed. Check console for details.')
          }
        } else {
          console.error('Create event failed (non-axios):', apiErr)
          alert('Create failed.')
        }
      } finally {
        setSubmitting(false)
      }
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        mapYupErrors(err)
        return
      }

      console.error('Unexpected validation error:', err)
      alert('Validation failed.')
    }
  }

  const handlePosterChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null

    clearError('image')
    clearError('poster_url')

    if (!file) {
      setPosterFile(null)
      setPosterPreview('')
      setError('image', 'File is required')
      return
    }

    const posterPayload: UploadEventPosterSchema = {
      image: file
    }

    // validate file (size/type) bằng yup schema
    try {
      await uploadEventPoster.validate(posterPayload, {
        abortEarly: false,
        stripUnknown: true
      })
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const message =
          err.inner
            .map((e) => e.message)
            .filter(Boolean)
            .join(' | ') || err.message

        setError('image', message)
        return
      }

      console.error('Unexpected poster validation error:', err)
      setError('image', 'Upload failed')
      return
    }

    // Không upload ngay, chỉ lưu file + preview local
    setPosterFile(file)
    setPosterPreview(URL.createObjectURL(file))
  }

  return (
    <section className='py-10 sm:py-14'>
      <Container>
        <header className='mb-8 max-w-2xl mx-auto'>
          <h2 className='text-3xl font-semibold text-gray-100'>
            Create a New Event
          </h2>
          <p className='mt-1 text-sm text-gray-400'>
            Fill out the details below to publish a new event.
          </p>
        </header>

        <Card className='bg-gray-950 border-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl max-w-2xl mx-auto'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Title */}
            <div>
              <label htmlFor='title' className={labelBase}>
                Event Title
              </label>
              <input
                type='text'
                id='title'
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (errors.title) clearError('title')
                }}
                className={inputBase}
              />
              {errors.title && (
                <p className='text-red-500 text-xs mt-1'>{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor='description' className={labelBase}>
                Description
              </label>
              <textarea
                id='description'
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  if (errors.description) clearError('description')
                }}
                rows={4}
                className={inputBase + ' resize-none'}
              />
              {errors.description && (
                <p className='text-red-500 text-xs mt-1'>
                  {errors.description}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label htmlFor='location' className={labelBase}>
                Location
              </label>
              <input
                type='text'
                id='location'
                value={locationText}
                onChange={(e) => {
                  setLocationText(e.target.value)
                  if (errors.location_text) clearError('location_text')
                }}
                className={inputBase}
              />
              {errors.location_text && (
                <p className='text-red-500 text-xs mt-1'>
                  {errors.location_text}
                </p>
              )}
            </div>

            {/* Poster upload */}
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
                disabled={submitting}
              />

              {uploadingPoster && (
                <p className='mt-1 text-xs text-gray-400'>
                  Uploading poster...
                </p>
              )}

              {errors.image && (
                <p className='mt-1 text-xs text-red-500'>{errors.image}</p>
              )}

              {posterPreview && (
                <div className='mt-3'>
                  <img
                    src={posterPreview}
                    alt='poster preview'
                    className='h-48 w-full rounded-xl object-cover border border-gray-800 shadow-md'
                  />
                </div>
              )}
            </div>

            {/* Time */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <label htmlFor='startAt' className={labelBase}>
                  Start at
                </label>
                <input
                  type='datetime-local'
                  id='startAt'
                  value={startAt}
                  onChange={(e) => {
                    setStartAt(e.target.value)
                    if (errors.start_at) clearError('start_at')
                    if (errors.end_at) clearError('end_at')
                  }}
                  className={inputBase}
                />
                {errors.start_at && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.start_at}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor='endAt' className={labelBase}>
                  End at
                </label>
                <input
                  type='datetime-local'
                  id='endAt'
                  value={endAt}
                  onChange={(e) => {
                    setEndAt(e.target.value)
                    if (errors.end_at) clearError('end_at')
                  }}
                  className={inputBase}
                />
                {errors.end_at && (
                  <p className='text-red-500 text-xs mt-1'>{errors.end_at}</p>
                )}
              </div>
            </div>

            {/* Price + Capacity */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <label htmlFor='price' className={labelBase}>
                  Price (currency)
                </label>
                <input
                  type='number'
                  id='price'
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value)
                    if (errors.price_cents) clearError('price_cents')
                  }}
                  min='0'
                  step='0.01'
                  placeholder='e.g. 15.00'
                  className={inputBase}
                />
                {errors.price_cents && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.price_cents}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor='capacity' className={labelBase}>
                  Capacity
                </label>
                <input
                  type='number'
                  id='capacity'
                  value={capacity}
                  onChange={(e) => {
                    setCapacity(e.target.value)
                    if (errors.capacity) clearError('capacity')
                  }}
                  min='1'
                  className={inputBase}
                />
                {errors.capacity && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.capacity}
                  </p>
                )}
              </div>
            </div>

            <div className='flex justify-end pt-2'>
              <Button
                type='submit'
                disabled={submitting}
                className='rounded-xl bg-pink-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-pink-700 focus:ring-2 focus:ring-pink-500'
              >
                {submitting ? 'Creating…' : 'Create Event'}
              </Button>
            </div>
          </form>
        </Card>
      </Container>
    </section>
  )
}
