import { useEffect, useState } from 'react';
import Button from "../../../components/Button";
import Container from "../../../components/Container/Container";
import Card from '../../../components/Card/Card';
import { useNavigate, useParams } from 'react-router-dom';
import http from '../../../utils/http'

export default function UpdateEventPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationText, setLocationText] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [price, setPrice] = useState('');
  const [capacity, setCapacity] = useState('');
  const [posterUrl, setPosterUrl] = useState('')
  const [uploadingPoster, setUploadingPoster] = useState(false)
  const [posterError, setPosterError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // Use mock/sample data only for local testing
    const sample = {
      id: id ?? 'demo-id',
      title: 'Sample Event (mock)',
      description: 'A conference exploring emerging technologies and innovation trends.',
      location_text: 'Hall A · City Expo Center',
      poster_url: '',
      start_at: '2025-11-20T09:00:00.000Z',
      end_at: '2025-11-20T17:00:00.000Z',
      price_cents: 2500,
      capacity: 150,
    }

    setLoading(true)
    setTimeout(() => {
      setTitle(sample.title)
      setDescription(sample.description)
      setLocationText(sample.location_text)
      setPosterUrl(sample.poster_url || '')
      setStartAt(sample.start_at ? new Date(sample.start_at).toISOString().slice(0,16) : '')
      setEndAt(sample.end_at ? new Date(sample.end_at).toISOString().slice(0,16) : '')
      setPrice(sample.price_cents ? String((sample.price_cents/100)) : '')
      setCapacity(sample.capacity ? String(sample.capacity) : '')
      setLoading(false)
    }, 200)
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSubmitting(true)
    try {
      // Simulate update success using mock behavior (no network)
      await new Promise((r) => setTimeout(r, 300))
      alert('Event updated (mock)')
      navigate('/events/organizer')
    } catch (err) {
      console.error('Update failed', err)
      alert('Failed to update event')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <header className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold">Update Event</h2>
        </header>
        <Card>
          {loading ? (
            <div className="p-6">Loading…</div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium">Event Title</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium">Description</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="location" className="block text-sm font-medium">Location</label>
                <input type="text" id="location" value={locationText} onChange={(e) => setLocationText(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
              </div>

              <div>
                <label htmlFor="poster" className="block text-sm font-medium">Poster image</label>
                <input
                  type="file"
                  id="poster"
                  accept="image/*"
                  className="mt-1 block w-full text-sm"
                  onChange={async (ev) => {
                    const file = ev.target.files && ev.target.files[0]
                    setPosterError(null)
                    if (!file) return
                    const form = new FormData()
                    form.append('image', file)
                    try {
                      setUploadingPoster(true)
                      const res = await http.post('/medias/image', form, { headers: { 'Content-Type': 'multipart/form-data' } })
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

                {uploadingPoster && <div className="mt-2 text-xs text-gray-500">Uploading poster…</div>}
                {posterError && <div className="mt-2 text-xs text-red-500">{posterError}</div>}
                {posterUrl && (
                  <div className="mt-2">
                    <img src={posterUrl} alt="poster" className="h-40 w-auto rounded-md object-cover border" />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="startAt" className="block text-sm font-medium">Start at</label>
                <input type="datetime-local" id="startAt" value={startAt} onChange={(e) => setStartAt(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
              </div>

              <div>
                <label htmlFor="endAt" className="block text-sm font-medium">End at</label>
                <input type="datetime-local" id="endAt" value={endAt} onChange={(e) => setEndAt(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium">Price (currency units)</label>
                <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} min="0" placeholder="e.g., 1500 (will be converted to cents)" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
              </div>

              <div>
                <label htmlFor="capacity" className="block text-sm font-medium">Capacity</label>
                <input type="number" id="capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} min="1" placeholder="e.g., 500" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
              </div>

              <div className="sm:col-span-2 text-right">
                <Button type="submit" disabled={submitting}>{submitting ? 'Updating…' : 'Update Event'}</Button>
              </div>
            </form>
          )}
        </Card>
      </Container>
    </section>
  )
}
