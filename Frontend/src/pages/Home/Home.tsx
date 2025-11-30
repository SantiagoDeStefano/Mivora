import React from "react";
import { Surface } from "../../components/Card/Card";
import Button from "../../components/Button";
import Badge from "../../components/Badge/Badge";
import Container from "../../components/Container/Container";
import { Link, useNavigate } from "react-router-dom";



export type EventItem = {
  id: string | number;
  organizer_id?: string;
  title: string;
  description?: string;
  poster_url?: string;
  location_text?: string;
  start_at?: string;
  end_at?: string;
  price_cents?: number;
  checked_in?: number;
  capacity?: number;
  status?: string;
  trending?: boolean;
};

type HomePageProps = {
  events?: EventItem[] | null;
  loading?: boolean;
  onViewEvent?: (id: string | number) => void;
  onApply?: () => void;
};

export function HomePage({
  events = null,
  loading = false,
}: HomePageProps) {

  const formatDate = (iso?: string) => {
    if (!iso) return ''
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
    if (!cents) return 'Free'
    if (cents >= 1000) return `From ${(cents / 1000).toFixed(0)}K`
    return `From ${cents}`
  }

  return (
    <section id="explore" className="py-10 sm:py-14">
      <Container>
        <header className="mb-6 sm:mb-8">
          <h2 className="mt-1 text-2xl sm:text-3xl font-semibold">Explore events</h2>
        </header>

        {/* Loading skeleton */}
        {(loading || events === null) && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Surface key={i} className="overflow-hidden border-gray-200 dark:border-gray-800">
                <div className="aspect-[4/3] animate-pulse bg-gray-200 dark:bg-gray-800" />
                <div className="p-5 space-y-2">
                  <div className="h-3 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-3 w-36 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                </div>
              </Surface>
            ))}
          </div>
        )}

        {/* Empty state */}
        {Array.isArray(events) && events.length === 0 && !loading && (
          <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-gray-600 dark:border-gray-800 dark:text-gray-300">
            No events yet — try adjusting filters.
          </div>
        )}

        {/* Grid of events */}
        {Array.isArray(events) && events.length > 0 && !loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <Surface
                key={e.id}
                className="overflow-hidden border-gray-600 bg-gray-100 text-white transition hover:shadow-xl focus-within:ring-2 focus-within:ring-pink-500"
              >
                <div
                  className="aspect-[4/3] w-full bg-cover bg-center"
                  style={{ backgroundImage: e.poster_url ? `url(${e.poster_url})` : undefined }}
                />
                <div className="p-5">
                  <div className="text-xs font-medium uppercase tracking-wide text-pink-400">
                    {formatDate(e.start_at)}
                  </div>
                  <h3 className="mt-1 text-base font-semibold">{e.title}</h3>
                  {e.location_text && (
                    <p className="mt-1 text-sm text-gray-300">{e.location_text} • {formatPrice(e.price_cents)}</p>
                  )}
                  {e.description && <p className="mt-2 text-sm text-gray-300">{e.description}</p>}

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      
                      <Link
                        to={`/events/${e.id}`}
                        className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-sm font-medium bg-pink-500 hover:bg-gray-200 -800 dark:hover:bg-gray-700"
                      >
                        View event
                      </Link>
                      
                    </div>
                    {e.trending && <Badge tone="pink">Trending</Badge>}
                  </div>
                </div>
              </Surface>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

// Mock data for UI display (container)
const mockEvents: EventItem[] = [
  {
    id: '41ed9c97-0685-4afb-ad0b-dab7024796e2',
    organizer_id: '2d0ae3c7-a849-48f0-bb3a-ec155fc4f485',
    title: 'COPNCACACAC',
    description: 'A conference exploring emerging technologies and innovation trends.',
    poster_url: 'https://example.com/posters/tech-summit-2025.jpg',
    location_text: '123 Main Street, San Francisco, CA',
    start_at: '2025-11-20T09:00:00.000Z',
    end_at: '2025-11-20T17:00:00.000Z',
    price_cents: 2500,
    checked_in: 0,
    capacity: 150,
    status: 'draft'
  },
  {
    id: '9f7d2c21-6b54-4359-8c96-96e9e8a320d4',
    organizer_id: '2d0ae3c7-a849-48f0-bb3a-ec155fc4f485',
    title: 'COPNCACACAC',
    description: 'A conference exploring emerging technologies and innovation trends.',
    poster_url: 'https://example.com/posters/tech-summit-2025.jpg',
    location_text: '123 Main Street, San Francisco, CA',
    start_at: '2025-11-20T09:00:00.000Z',
    end_at: '2025-11-20T17:00:00.000Z',
    price_cents: 2500,
    checked_in: 0,
    capacity: 150,
    status: 'draft'
  },
  {
    id: 'cca3cfcf-7232-4d8f-b236-685afc8d50f0',
    organizer_id: '2d0ae3c7-a849-48f0-bb3a-ec155fc4f485',
    title: 'COPNCACACAC',
    description: 'A conference exploring emerging technologies and innovation trends.',
    poster_url: 'https://example.com/posters/tech-summit-2025.jpg',
    location_text: '123 Main Street, San Francisco, CA',
    start_at: '2025-11-20T09:00:00.000Z',
    end_at: '2025-11-20T17:00:00.000Z',
    price_cents: 2500,
    checked_in: 0,
    capacity: 150,
    status: 'draft'
  },
  {
    id: '78990872-70d3-45f2-b477-8a7df60c9627',
    organizer_id: '2d0ae3c7-a849-48f0-bb3a-ec155fc4f485',
    title: 'COPNCACACAC',
    description: 'A conference exploring emerging technologies and innovation trends.',
    poster_url: 'https://example.com/posters/tech-summit-2025.jpg',
    location_text: '123 Main Street, San Francisco, CA',
    start_at: '2025-11-20T09:00:00.000Z',
    end_at: '2025-11-20T17:00:00.000Z',
    price_cents: 2500,
    checked_in: 0,
    capacity: 150,
    status: 'draft'
  },
  {
    id: '938d910f-c5fa-40b1-9368-98ccdb882f32',
    organizer_id: '2d0ae3c7-a849-48f0-bb3a-ec155fc4f485',
    title: 'COPNCACACAC',
    description: 'A conference exploring emerging technologies and innovation trends.',
    poster_url: 'https://example.com/posters/tech-summit-2025.jpg',
    location_text: '123 Main Street, San Francisco, CA',
    start_at: '2025-11-20T09:00:00.000Z',
    end_at: '2025-11-20T17:00:00.000Z',
    price_cents: 2500,
    checked_in: 0,
    capacity: 150,
    status: 'draft'
  },
  {
    id: '2c03f341-ba14-4c8a-9974-ec9373c7eb99',
    organizer_id: '2d0ae3c7-a849-48f0-bb3a-ec155fc4f485',
    title: 'COPNCACACAC',
    description: 'A conference exploring emerging technologies and innovation trends.',
    poster_url: 'https://example.com/posters/tech-summit-2025.jpg',
    location_text: '123 Main Street, San Francisco, CA',
    start_at: '2025-11-20T09:00:00.000Z',
    end_at: '2025-11-20T17:00:00.000Z',
    price_cents: 2500,
    checked_in: 0,
    capacity: 150,
    status: 'draft'
  }
]

// Container: manages state and navigation and passes props to ExplorePage
export default function Explore() {
  const navigate = useNavigate()

  const handleViewEvent = (id: string | number) => {
    navigate(`/events/${id}`)
  }
  


  return (
    <HomePage
      events={mockEvents}
      loading={false}
      onViewEvent={handleViewEvent}
    />
  )
}
