import { useState } from 'react';
import Button from "../../../components/Button";
import Container from "../../../components/Container/Container";
import Card from '../../../components/Card/Card';
import { useNavigate } from 'react-router-dom';
import http from '../../../utils/http'

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationText, setLocationText] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [price, setPrice] = useState(''); // Use string for input, parse on submit
  const [capacity, setCapacity] = useState(''); // Use string for input, parse on submit
  const [posterUrl, setPosterUrl] = useState('')
  const [uploadingPoster, setUploadingPoster] = useState(false)
  const [posterError, setPosterError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build payload matching backend fields
    setSubmitting(true)
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        poster_url: posterUrl || undefined,
        location_text: locationText.trim(),
        start_at: startAt ? new Date(startAt).toISOString() : undefined,
        end_at: endAt ? new Date(endAt).toISOString() : undefined,
        // interpret price input as whole currency units and convert to cents
        price_cents: isNaN(Number(price)) ? 0 : Math.round(Number(price) * 100),
        checked_in: 0,
        capacity: parseInt(capacity || '0', 10) || 0
      }

      console.log('Create event payload:', payload)
      const res = await http.post('/events', payload)
      if (res?.data) {
        // optionally show created id and navigate to organizer manage page
        const created = res.data.result
        console.log('Event created:', created)
        navigate('/organizer/dashboard')
      }
    } catch (err) {
      console.error('Create event failed', err)
      alert('Failed to create event. See console for details.')
    } finally {
      setSubmitting(false)
    }
  };

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <header className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold">Create a New Event</h2>
        </header>
        <Card>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Title */}
            <div className="sm:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium">Event Title</label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium">Description</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
            </div>

            {/* --- ADDED THIS SECTION --- */}
            {/* Location */}
            <div className="sm:col-span-2">
              <label htmlFor="location" className="block text-sm font-medium">Location</label>
              <input type="text" id="location" value={locationText} onChange={(e) => setLocationText(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
            </div>

            {/* Poster Upload */}
            <div>
              <label htmlFor="poster" className="block text-sm font-medium">Poster image</label>
              <input
                type="file"
                id="poster"
                accept="image/*"
                className="mt-1 block w-full text-sm"
                onChange={async (e) => {
                  const file = e.target.files && e.target.files[0]
                  setPosterError(null)
                  if (!file) return
                  // Upload to backend /medias/image as form-data with field name 'image'
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

              {uploadingPoster && <div className="mt-2 text-xs text-gray-500">Uploading poster…</div>}
              {posterError && <div className="mt-2 text-xs text-red-500">{posterError}</div>}
              {posterUrl && (
                <div className="mt-2">
                  <img src={posterUrl} alt="poster" className="h-40 w-auto rounded-md object-cover border" />
                </div>
              )}
            </div>

            {/* Start */}
            <div>
              <label htmlFor="startAt" className="block text-sm font-medium">Start at</label>
              <input type="datetime-local" id="startAt" value={startAt} onChange={(e) => setStartAt(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
            </div>

            {/* End */}
            <div>
              <label htmlFor="endAt" className="block text-sm font-medium">End at</label>
              <input type="datetime-local" id="endAt" value={endAt} onChange={(e) => setEndAt(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium">Price (currency units)</label>
              <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} min="0" placeholder="e.g., 1500 (will be converted to cents)" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
            </div>
            
            {/* Capacity */}
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium">Capacity</label>
              <input type="number" id="capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} min="1" placeholder="e.g., 500" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
            </div>

            {/* status removed — backend will default */}
            {/* --- END OF ADDED SECTION --- */}

            <div className="sm:col-span-2 text-right">
              <Button type="submit" disabled={submitting}>{submitting ? 'Creating…' : 'Create Event'}</Button>
            </div>
          </form>
        </Card>
      </Container>
    </section>
  );
}






