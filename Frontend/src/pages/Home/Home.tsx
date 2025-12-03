import { useEffect, useRef, useContext, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInfiniteQuery } from '@tanstack/react-query'

import { Surface } from '../../components/Card/Card'
import Badge from '../../components/Badge/Badge'
import Container from '../../components/Container/Container'
import eventsApi, { Event } from '../../apis/events.api'
import path from '../../constants/path'
import { AppContext } from '../../contexts/app.context'

const PAGE_SIZE = 20

export default function Home() {
  const navigate = useNavigate()
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const { profile, isAuthenticated } = useContext(AppContext)

  const [currentSlide, setCurrentSlide] = useState(0)

  const isOrganizer = (() => {
    const r = (profile as any)?.role
    if (!r) return false
    if (Array.isArray(r)) return r.map((x: string) => x.toLowerCase()).includes('organizer')
    return String(r).toLowerCase() === 'organizer'
  })()

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery<any, Error, any, any, number>({
    queryKey: ['events'],
    queryFn: ({ pageParam = 1 }) => eventsApi.getEvents(PAGE_SIZE, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      // lastPage is an AxiosResponse<GetEventsResponse>
      const meta = lastPage?.data?.result
      if (!meta) return undefined
      return meta.page < meta.total_page ? meta.page + 1 : undefined
    }
  })

  const events: Event[] =
    data?.pages.flatMap((page) => page?.data?.result?.events ?? []) ?? []

  // subset cho Trending
  const trendingEvents: Event[] = useMemo(() => {
    if (!events.length) return []
    const shuffled = [...events].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(10, shuffled.length))
  }, [events])

  if (isError) {
    console.error('Error fetching events:', error)
  }

  const handleViewEvent = (id: string) => {
    navigate(`/events/${id}`)
  }

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
    return `$${(cents / 100).toFixed(2)}`
  }

  // IntersectionObserver để load thêm trang
  useEffect(() => {
    if (!loadMoreRef.current) return
    const el = loadMoreRef.current

    const observer = new IntersectionObserver((entries) => {
      const first = entries[0]
      if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    })

    observer.observe(el)

    return () => {
      observer.unobserve(el)
      observer.disconnect()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // Auto slideshow trending: 1 event mỗi lần
  useEffect(() => {
    if (!trendingEvents.length) return

    // reset về slide 0 mỗi khi list đổi để tránh out-of-range
    setCurrentSlide(0)

    const interval = window.setInterval(() => {
      setCurrentSlide((prev) =>
        prev + 1 >= trendingEvents.length ? 0 : prev + 1
      )
    }, 4000) // đổi slide mỗi 4 giây

    return () => {
      window.clearInterval(interval)
    }
  }, [trendingEvents.length])

  return (
    <section id="explore" className="py-10 sm:py-14">
      <section className="relative w-full h-[60vh] min-h-[380px] flex items-center justify-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg">
            Discover Amazing Events
          </h1>

          <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto">
            Find concerts, meetups, workshops and more - happening near you.
          </p>

          {/* CTA Buttons */}
          <div className="mt-6 flex justify-center gap-4">
            <button
              className="px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-medium text-sm"
              onClick={() => {
                const el = document.getElementById('events-grid')
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                } else {
                  navigate(`${path.home}#events-grid`)
                }
              }}
            >
              Browse Events
            </button>

            <button
              className={`px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium text-sm backdrop-blur ${
                !isOrganizer ? 'cursor-not-allowed' : ''
              }`}
              onClick={() => {
                if (!isAuthenticated) {
                  navigate(path.login)
                  return
                }
                if (!isOrganizer) {
                  alert(
                    'Only organizers can create events. Please upgrade your account or contact support.'
                  )
                  return
                }
                navigate(path.organizer_create_event)
              }}
              disabled={!isOrganizer}
              title={
                !isOrganizer ? 'Only organizers can create events' : 'Create an event'
              }
            >
              Create Event
            </button>
          </div>
        </div>
      </section>

      <Container>
        {/* Trending slideshow */}
        {!isLoading && trendingEvents.length > 0 && (
          <section className="mt-10 mb-10">
            <h2 className="mb-4 text-2xl sm:text-3xl font-semibold">
              Trending Events
            </h2>

            <div className="relative w-full overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{
                  width: `${trendingEvents.length * 100}%`,
                  transform: `translateX(-${
                    currentSlide * (100 / trendingEvents.length)
                  }%)`
                }}
              >
                {trendingEvents.map((e) => (
                  <div
                    key={e.id}
                    className="w-full flex-shrink-0"
                    style={{ width: `${100 / trendingEvents.length}%` }}
                  >
                    <div
                      className="h-[260px] sm:h-[360px] md:h-[420px] bg-cover bg-center rounded-2xl shadow-lg cursor-pointer"
                      onClick={() => handleViewEvent(e.id)}
                      style={{
                        backgroundImage: e.poster_url
                          ? `linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.15)), url(${e.poster_url})`
                          : 'linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.15))',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <div className="p-6 sm:p-10 flex flex-col justify-end h-full text-white">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-lg line-clamp-2">
                          {e.title}
                        </h3>
                        <p className="mt-2 text-sm sm:text-base text-gray-200 line-clamp-1">
                          {formatDate(e.start_at)} • {e.location_text}
                        </p>
                        <p className="mt-1 text-xs sm:text-sm text-gray-200">
                          {e.price_cents ? `From ${formatPrice(e.price_cents)}` : 'Free entry'}
                        </p>
                        <button
                          onClick={(event) => {
                            event.stopPropagation()
                            handleViewEvent(e.id)
                          }}
                          className="mt-4 px-5 py-2 text-sm sm:text-base rounded-xl bg-pink-500 hover:bg-pink-600 text-white shadow-md w-fit"
                        >
                          View Event
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <header className="mt-4 mb-6 sm:mb-8">
          <h2 className="mt-1 text-2xl sm:text-3xl font-semibold">Explore events</h2>
        </header>

        {/* Loading skeleton for initial load */}
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Surface
                key={i}
                className="overflow-hidden border border-gray-800 bg-gray-900"
              >
                <div className="aspect-[4/3] animate-pulse bg-gray-800" />
                <div className="p-5 space-y-2">
                  <div className="h-3 w-28 animate-pulse rounded bg-gray-800" />
                  <div className="h-4 w-48 animate-pulse rounded bg-gray-800" />
                  <div className="h-3 w-36 animate-pulse rounded bg-gray-800" />
                </div>
              </Surface>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && events.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-800 p-10 text-center text-sm text-gray-300 bg-gray-900">
            No events yet — try again later.
          </div>
        )}

        {/* Grid of events */}
        {!isLoading && events.length > 0 && (
          <>
            <div
              id="events-grid"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {events.map((e) => (
                <Surface
                  key={e.id}
                  className="overflow-hidden border border-gray-800 bg-gray-900 text-gray-100 transition hover:shadow-xl focus-within:ring-2 focus-within:ring-pink-500"
                >
                  <div
                    className="aspect-[4/3] w-full bg-cover bg-center"
                    style={{
                      backgroundImage: e.poster_url ? `url(${e.poster_url})` : undefined
                    }}
                  />
                  <div className="p-5">
                    <div className="text-xs font-medium uppercase tracking-wide text-pink-400">
                      {formatDate(e.start_at)}
                    </div>

                    <h3 className="mt-1 text-base font-semibold">{e.title}</h3>

                    <p className="mt-1 text-sm text-gray-200">{e.location_text}</p>

                    <p className="mt-1 text-sm text-gray-200">
                      Price: {formatPrice(e.price_cents)}
                    </p>

                    {e.description && (
                      <p className="mt-2 text-sm text-gray-300 line-clamp-3">
                        {e.description}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleViewEvent(e.id)}
                          className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-sm font-medium bg-pink-500 hover:bg-pink-600 text-white"
                        >
                          View event
                        </button>
                      </div>

                      {e.status === 'published' && (
                        <Badge tone="pink">Published</Badge>
                      )}
                      {e.status === 'draft' && (
                        <Badge tone="neutral">Draft</Badge>
                      )}
                      {e.status === 'canceled' && (
                        <Badge tone="warn">Canceled</Badge>
                      )}
                    </div>
                  </div>
                </Surface>
              ))}
            </div>

            {/* Sentinel for infinite scroll */}
            <div ref={loadMoreRef} className="mt-6 flex justify-center">
              {isFetchingNextPage && (
                <span className="text-sm text-gray-400">Loading more…</span>
              )}
              {!hasNextPage && (
                <span className="text-xs text-gray-500">
                  You&apos;ve reached the end.
                </span>
              )}
            </div>
          </>
        )}
      </Container>
    </section>
  )
}
