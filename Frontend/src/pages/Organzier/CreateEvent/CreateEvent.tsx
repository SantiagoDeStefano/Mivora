import { useState } from 'react'
import axios from 'axios'
import Button from '../../../components/Button'
import Container from '../../../components/Container/Container'
import Card from '../../../components/Card/Card'
import { useNavigate } from 'react-router-dom'
import eventsApi from '../../../apis/events.api'
import http from '../../../utils/http'
import path from '../../../constants/path'

export default function CreateEventPage() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [locationText, setLocationText] = useState('')
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')
  const [price, setPrice] = useState('')
  const [capacity, setCapacity] = useState('')
  const [posterUrl, setPosterUrl] = useState('')
  const [uploadingPoster, setUploadingPoster] = useState(false)
  const [posterError, setPosterError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const inputBase =
    'mt-1 block w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 shadow-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500'

  const labelBase = 'block text-sm font-medium text-gray-300'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('Title is required.')
      return
    }
    if (!description.trim()) {
      alert('Description is required.')
      return
    }
    if (!locationText.trim()) {
      alert('Location is required.')
      return
    }
    if (!startAt || !endAt) {
      alert('Start and end time are required.')
      return
    }

    const start = new Date(startAt)
    const end = new Date(endAt)
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      alert('Invalid date/time.')
      return
    }
    if (end <= start) {
      alert('End time must be after start time.')
      return
    }

    const priceNumber = Number(price)
    if (isNaN(priceNumber) || priceNumber < 0) {
      alert('Price must be a non-negative number.')
      return
    }

    const capacityNumber = parseInt(capacity || '0', 10)
    if (!capacityNumber || capacityNumber <= 0) {
      alert('Capacity must be greater than 0.')
      return
    }

    setSubmitting(true)

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        poster_url: posterUrl || undefined,
        location_text: locationText.trim(),
        start_at: start.toISOString(),
        end_at: end.toISOString(),
        price_cents: Math.round(priceNumber * 100),
        capacity: capacityNumber
      }

      console.log('Create event payload:', payload)

      const res = await eventsApi.createEvent(payload)

      if (res?.data?.result) {
        console.log('Event created:', res.data.result)
        navigate(path.organizer_manage_event)
      } else {
        console.warn('Create event: unexpected response shape', res)
        alert('Event created, but response was unexpected.')
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Create event failed:', {
          status: err.response?.status,
          data: err.response?.data
        })
        alert('Create failed. Check console for details.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <header className="mb-8 max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold text-gray-100">Create a New Event</h2>
          <p className="mt-1 text-sm text-gray-400">
            Fill out the details below to publish a new event.
          </p>
        </header>

        <Card className="bg-gray-950 border-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                required
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
                required
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
                onChange={async (e) => {
                  const file = e.target.files?.[0]
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
                    const url =
                      Array.isArray(result) && result[0]?.url
                        ? result[0].url
                        : result?.url

                    if (url) {
                      setPosterUrl(url)
                    } else {
                      setPosterError('Upload failed: invalid response')
                    }
                  } catch (err: any) {
                    console.error('Poster upload error', err)
                    setPosterError('Upload failed')
                  } finally {
                    setUploadingPoster(false)
                  }
                }}
              />

              {uploadingPoster && (
                <p className="mt-1 text-xs text-gray-400">Uploading…</p>
              )}
              {posterError && (
                <p className="mt-1 text-xs text-red-500">{posterError}</p>
              )}

              {posterUrl && (
                <div className="mt-3">
                  <img
                    src={posterUrl}
                    alt="poster"
                    className="h-48 w-full rounded-xl object-cover border border-gray-800 shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Time + Price/Capacity in 2-column layout, nhưng card hẹp nên không bị quá dài */}
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
                  required
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
                  required
                />
              </div>
            </div>

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
                  required
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
                  min="1"
                  className={inputBase}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-pink-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-pink-700 focus:ring-2 focus:ring-pink-500"
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
