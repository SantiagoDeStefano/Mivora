import { useEffect, useMemo, useState } from 'react'
import Container from '../../../components/Container/Container'
import Badge from '../../../components/Badge/Badge'
import { Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import path from '../../../constants/path'
import usersApi from '../../../apis/users.api'

type EventStatus = 'draft' | 'published' | 'canceled'

interface OrganizerEvent {
  id: string
  title: string
  start_at: string
  status: EventStatus
  revenue?: number
}

export default function ManageEventPage() {
  const navigate = useNavigate()

  const [events, setEvents] = useState<OrganizerEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [isRefetching, setIsRefetching] = useState(false)

  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all')

  useEffect(() => {
    const id = window.setTimeout(() => {
      setSearchTerm(searchInput.trim())
    }, 400)

    return () => {
      window.clearTimeout(id)
    }
  }, [searchInput])

  const fetchOrganizerEvents = async (term: string) => {
    const firstLoad = events.length === 0

    try {
      if (firstLoad) {
        setLoading(true)
      } else {
        setIsRefetching(true)
      }

      const limit = 50
      let page = 1
      let allEvents: OrganizerEvent[] = []

      while (true) {
        const res = term
          ? await usersApi.searchEventsOrganizer(term, limit, page)
          : await usersApi.getCreatedEvents(limit, page)

        const result = res.data.result

        const mapped: OrganizerEvent[] = result.events.map((ev: any) => ({
          id: ev.id,
          title: ev.title,
          start_at: ev.start_at,
          status: ev.status as EventStatus,
          // Sửa chỗ này theo đúng field backend của mày
          // ví dụ nếu backend trả revenue_cents:
          // revenue: ev.revenue_cents != null ? ev.revenue_cents / 100 : 0
          revenue: ev.revenue ?? 0
        }))

        allEvents = [...allEvents, ...mapped]

        if (result.page >= result.total_page) break
        page++
      }

      setEvents(allEvents)
    } catch (err) {
      console.error('Error loading organizer events:', err)
      if (events.length === 0) setEvents([])
    } finally {
      setLoading(false)
      setIsRefetching(false)
    }
  }

  useEffect(() => {
    fetchOrganizerEvents(searchTerm)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm])

  const filtered = useMemo(() => {
    let list = [...events]

    if (statusFilter !== 'all') {
      list = list.filter((e) => e.status === statusFilter)
    }

    return list
  }, [events, statusFilter])

  const total = events.length
  const totalDraft = events.filter((e) => e.status === 'draft').length
  const totalPublished = events.filter((e) => e.status === 'published').length
  const totalCanceled = events.filter((e) => e.status === 'canceled').length

  return (
    <section className='py-10 sm:py-14'>
      <Container>
        {/* Header + create button */}
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='flex flex-col gap-2'>
            <h2 className='text-2xl sm:text-3xl font-semibold'>Manage Events</h2>
            <div className='mt-3 flex flex-wrap items-center gap-2'>
              <Badge tone='pink'>Total: {total}</Badge>
              <Badge tone='neutral'>Draft: {totalDraft}</Badge>
              <Badge tone='success'>Published: {totalPublished}</Badge>
              <Badge tone='warn'>Canceled: {totalCanceled}</Badge>
            </div>
          </div>

          <button
            type='button'
            className='inline-flex items-center justify-center rounded-full bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-900'
            onClick={() => {
              navigate(path.organizer_create_event)
            }}
          >
            Create event
          </button>
        </div>

        {/* Controls: search + filter */}
        <div className='mt-6 flex flex-wrap items-center gap-3'>
          <div className='flex-1 min-w-[200px]'>
            <label className='block text-xs font-medium text-gray-300 mb-1'>Search events</label>
            <div className='relative'>
              <input
                className='w-full rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-100 shadow-sm outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-700 bg-gray-900'
                placeholder='Type event name…'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {isRefetching && (
                <span className='absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400'>
                  Searching…
                </span>
              )}
            </div>
          </div>

          <div className='mt-3 flex items-center gap-2'>
            <span className='text-xs font-medium text-gray-300'>Status</span>
            <div className='inline-flex rounded-full border border-gray-800 bg-gray-900 p-1 text-xs'>
              {[
                { label: 'All', value: 'all' as const },
                { label: 'Draft', value: 'draft' as const },
                { label: 'Published', value: 'published' as const },
                { label: 'Canceled', value: 'canceled' as const }
              ].map((opt) => {
                const active = statusFilter === opt.value
                return (
                  <button
                    key={opt.value}
                    type='button'
                    className={[
                      'rounded-full px-3 py-1 font-medium transition-colors',
                      active ? 'bg-gray-800 text-gray-100 shadow-sm' : 'text-gray-300 hover:text-gray-100'
                    ].join(' ')}
                    onClick={() => setStatusFilter(opt.value)}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && events.length === 0 && (
          <div className='mt-4 grid gap-2'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='h-12 rounded-lg animate-pulse bg-gray-800' />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className='mt-4 rounded-2xl border border-dashed p-8 text-center text-sm text-gray-300 border-gray-800'>
            No events found.
          </div>
        )}

        {/* Table */}
        {!loading && filtered.length > 0 && (
          <div className='mt-4 overflow-auto rounded-xl border border-gray-800'>
            <table className='min-w-full text-left text-sm' aria-label='Events table'>
              <thead className='bg-gray-900 sticky top-0 z-10'>
                <tr>
                  <th className='px-3 py-2 font-medium'>Name</th>
                  <th className='px-3 py-2 font-medium'>Date</th>
                  <th className='px-3 py-2 font-medium'>Status</th>
                  <th className='px-3 py-2 font-medium text-right'>Revenue</th>
                  <th className='px-3 py-2 font-medium text-right'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((event) => (
                  <tr key={event.id} className='border-t border-gray-800'>
                    <td className='px-3 py-3 font-medium'>{event.title}</td>
                    <td className='px-3 py-3 text-gray-300'>
                      {new Date(event.start_at).toLocaleDateString()}
                    </td>
                    <td className='px-3 py-3'>
                      {event.status === 'published' ? (
                        <Badge tone='success'>Published</Badge>
                      ) : event.status === 'canceled' ? (
                        <Badge tone='warn'>Canceled</Badge>
                      ) : (
                        <Badge tone='neutral'>Draft</Badge>
                      )}
                    </td>
                    <td className='px-3 py-3 text-right text-gray-300'>
                      {event.revenue != null
                        ? event.revenue.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD' // đổi sang VND hoặc cái mày đang dùng
                          })
                        : '—'}
                    </td>
                    <td className='px-3 py-3'>
                      <div className='flex items-center justify-end gap-2'>
                        <button
                          type='button'
                          className='inline-flex items-center gap-1 rounded-full bg-gray-800 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 focus:ring-offset-gray-900'
                          onClick={() => {
                            navigate(
                              path.organizer_created_event_details.replace(':id', event.id)
                            )
                          }}
                        >
                          <Eye className='h-3.5 w-3.5' />
                          View details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </section>
  )
}
