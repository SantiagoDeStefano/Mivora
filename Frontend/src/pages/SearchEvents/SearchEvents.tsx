
import { useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useInfiniteQuery } from '@tanstack/react-query'

import eventsApi, { Event } from '../../apis/events.api'
import Container from '../../components/Container/Container'
import { Surface } from '../../components/Card/Card'
import Badge from '../../components/Badge/Badge'
import Loading from '../../components/Loading'

const PAGE_SIZE = 20

export default function SearchEvents() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const q = params.get('q')?.trim() || ''

  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['search-events', q],
    queryFn: ({ pageParam = 1 }) => eventsApi.searchEvents(q, PAGE_SIZE, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      const meta = lastPage?.data?.result
      if (!meta) return undefined
      return meta.page < meta.total_page ? meta.page + 1 : undefined
    },
    enabled: !!q
  })

  const events: Event[] =
    data?.pages.flatMap((page: any) => page?.data?.result?.events ?? []) ?? []

  if (isError) {
    console.error('Error searching events:', error)
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

  // IntersectionObserver để auto load trang tiếp theo
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return
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

  return (
    <section className='py-10 sm:py-14'>
      <Container>
        <header className='mb-6 sm:mb-8'>
          <p className='text-xs uppercase tracking-wide text-pink-400'>
            Search results
          </p>
          <h1 className='mt-1 text-2xl sm:text-3xl font-semibold text-gray-100'>
            {q ? (
              <>
                Results for <span className='text-pink-400'>&quot;{q}&quot;</span>
              </>
            ) : (
              'Search events'
            )}
          </h1>
        </header>

        {!q && (
          <div className='rounded-2xl border border-dashed border-gray-800 p-10 text-center text-sm text-gray-300 bg-gray-900'>
            Enter a search query in the header to find events.
          </div>
        )}

        {q && isLoading && <Loading />}

        {q && !isLoading && events.length === 0 && (
          <div className='rounded-2xl border border-dashed border-gray-800 p-10 text-center text-sm text-gray-300 bg-gray-900'>
            No events found for &quot;{q}&quot;.
          </div>
        )}

        {q && !isLoading && events.length > 0 && (
          <>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {events.map((e) => (
                <Surface
                  key={e.id}
                  className='overflow-hidden border border-gray-800 bg-gray-900 text-gray-100 transition hover:shadow-xl focus-within:ring-2 focus-within:ring-pink-500'
                >
                  <div
                    className='aspect-[4/3] w-full bg-cover bg-center'
                    style={{ backgroundImage: e.poster_url ? `url(${e.poster_url})` : undefined }}
                  />
                  <div className='p-5'>
                    <div className='text-xs font-medium uppercase tracking-wide text-pink-400'>
                      {formatDate(e.start_at)}
                    </div>

                    <h3 className='mt-1 text-base font-semibold'>{e.title}</h3>

                    <p className='mt-1 text-sm text-gray-200'>{e.location_text}</p>

                    <p className='mt-1 text-sm text-gray-200'>
                      Price: {formatPrice(e.price_cents)}
                    </p>

                    {e.description && (
                      <p className='mt-2 text-sm text-gray-300 line-clamp-3'>
                        {e.description}
                      </p>
                    )}

                    <div className='mt-3 flex items-center justify-between'>
                      <button
                        type='button'
                        onClick={() => handleViewEvent(e.id)}
                        className='inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-sm font-medium bg-pink-500 hover:bg-pink-600 text-white'
                      >
                        View event
                      </button>

                      {e.status === 'published' && <Badge tone='pink'>Published</Badge>}
                      {e.status === 'draft' && <Badge tone='neutral'>Draft</Badge>}
                      {e.status === 'canceled' && <Badge tone='warn'>Canceled</Badge>}
                    </div>
                  </div>
                </Surface>
              ))}
            </div>

            <div ref={loadMoreRef} className='mt-6 flex justify-center'>
              {isFetchingNextPage && (
                <span className='text-sm text-gray-400'>Loading more…</span>
              )}
              {!hasNextPage && (
                <span className='text-xs text-gray-500'>
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
