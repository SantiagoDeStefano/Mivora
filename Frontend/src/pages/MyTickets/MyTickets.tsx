// src/pages/Tickets/MyTicketsPage.tsx
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { Ticket, TicketApi } from '../../apis/tickets.api'
import { SuccessResponse } from '../../types/response.types'
import { GetOrSearchMyTicketsSchema } from '../../utils/rules'
import Container from '../../components/Container/Container'
import Badge from '../../components/Badge/Badge'
import path from '../../constants/path'
import usersApi from '../../apis/users.api'

type TicketStatus = 'booked' | 'checked_in' | 'canceled'

type GetMyTicketsResult = {
  tickets: TicketApi[]
  page: number
  total_page: number
}

type GetMyTicketsResponse = SuccessResponse<GetMyTicketsResult>

const LIMIT = 50

const formatPrice = (priceCents: number) => {
  if (!priceCents) return 'Free ticket'
  return `$${(priceCents / 100).toFixed(2)}`
}

const formatCheckedIn = (value: string | null) => {
  if (!value) return 'Not checked in'
  const d = new Date(value)
  return isNaN(d.getTime()) ? value : d.toLocaleString()
}

export default function MyTicketsPage() {
  const navigate = useNavigate()

  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [isRefetching, setIsRefetching] = useState(false)

  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all')

  // debounce searchInput -> searchTerm
  useEffect(() => {
    const id = window.setTimeout(() => {
      setSearchTerm(searchInput.trim())
    }, 400)

    return () => {
      window.clearTimeout(id)
    }
  }, [searchInput])

  const fetchTickets = async (term: string, status: TicketStatus | 'all') => {
    const firstLoad = tickets.length === 0

    try {
      if (firstLoad) {
        setLoading(true)
      } else {
        setIsRefetching(true)
      }

      let page = 1
      let all: Ticket[] = []

      while (true) {
        const params: GetOrSearchMyTicketsSchema = {
          limit: LIMIT,
          page
        }

        // rule q: 3–20 chars, nếu <3 coi như không search
        if (term.length >= 3 && term.length <= 20) {
          params.q = term
        }

        // filter status server-side (schema chỉ cho booked / checked_in)
        if (status !== 'all' && status !== 'canceled') {
          params.status = status
        }

        const res = await usersApi.searchMyTickets(params)
        const data = res.data as GetMyTicketsResponse
        const result = data.result

        // map TicketApi -> Ticket (ticket_status -> status)
        const mapped: Ticket[] = result.tickets.map((raw: TicketApi) => ({
          ...raw,
          status: raw.ticket_status
        }))

        all = all.concat(mapped)

        if (result.page >= result.total_page) break
        page++
      }

      setTickets(all)
    } catch (err) {
      console.error('Error loading my tickets:', err)
      if (tickets.length === 0) setTickets([])
    } finally {
      setLoading(false)
      setIsRefetching(false)
    }
  }

  // fetch khi mount + khi searchTerm/statusFilter (đã debounce) đổi
  useEffect(() => {
    fetchTickets(searchTerm, statusFilter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter])

  const filtered = useMemo(() => {
    let list = [...tickets]

    if (statusFilter !== 'all') {
      list = list.filter((t) => t.status === statusFilter)
    }

    return list
  }, [tickets, statusFilter])

  const total = tickets.length
  const totalBooked = tickets.filter((t) => t.status === 'booked').length
  const totalCheckedIn = tickets.filter((t) => t.status === 'checked_in').length
  const totalCanceled = tickets.filter((t) => t.status === 'canceled').length

  return (
    <section className='py-10 sm:py-14'>
      <Container>
        {/* Header + stats */}
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='flex flex-col gap-2'>
            <h2 className='text-2xl sm:text-3xl font-semibold'>My Tickets</h2>
            <div className='mt-3 flex flex-wrap items-center gap-2'>
              <Badge tone='pink'>Total: {total}</Badge>
              <Badge tone='neutral'>Booked: {totalBooked}</Badge>
              <Badge tone='success'>Checked in: {totalCheckedIn}</Badge>
              <Badge tone='warn'>Canceled: {totalCanceled}</Badge>
            </div>
          </div>

          <button
            type='button'
            className='inline-flex items-center justify-center rounded-full bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-900'
            onClick={() => {
              navigate(path.home)
            }}
          >
            Discover events
          </button>
        </div>

        {/* Controls: search + filter */}
        <div className='mt-6 flex flex-wrap items-center gap-3'>
          <div className='flex-1 min-w-[200px]'>
            <label className='block text-xs font-medium text-gray-300 mb-1'>Search tickets</label>
            <div className='relative'>
              <input
                className='w-full rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-100 shadow-sm outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-700 bg-gray-900'
                placeholder='Type ticket/event name…'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {isRefetching && (
                <span className='absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400'>Searching…</span>
              )}
            </div>
            <p className='mt-1 text-[11px] text-gray-400'>
              Search applies when length is between 3 and 20 characters.
            </p>
          </div>

          <div className='mt-3 flex items-center gap-2'>
            <span className='text-xs font-medium text-gray-300'>Status</span>
            <div className='inline-flex rounded-full border border-gray-800 bg-gray-900 p-1 text-xs'>
              {[
                { label: 'All', value: 'all' as const },
                { label: 'Booked', value: 'booked' as const },
                { label: 'Checked-in', value: 'checked_in' as const },
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

        {/* Loading skeleton – chỉ show khi chưa có data */}
        {loading && tickets.length === 0 && (
          <div className='mt-4 grid gap-2'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='h-12 rounded-lg animate-pulse bg-gray-800' />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className='mt-4 rounded-2xl border border-dashed p-8 text-center text-sm text-gray-300 border-gray-800'>
            No tickets found.
          </div>
        )}

        {/* Table */}
        {!loading && filtered.length > 0 && (
          <div className='mt-4 overflow-auto rounded-xl border border-gray-800'>
            <table className='min-w-full text-left text-sm' aria-label='Tickets table'>
              <thead className='bg-gray-900 sticky top-0 z-10'>
                <tr>
                  <th className='px-3 py-2 font-medium'>Event</th>
                  <th className='px-3 py-2 font-medium'>Price</th>
                  <th className='px-3 py-2 font-medium'>Status</th>
                  <th className='px-3 py-2 font-medium'>Checked in at</th>
                  <th className='px-3 py-2 font-medium text-right'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((ticket) => (
                  <tr key={ticket.id} className='border-t border-gray-800'>
                    <td className='px-3 py-3 font-medium'>
                      {ticket.event_title || (ticket as any).title || 'Untitled event'}
                    </td>
                    <td className='px-3 py-3 text-gray-300'>{formatPrice(ticket.price_cents)}</td>
                    <td className='px-3 py-3'>
                      {ticket.status === 'checked_in' ? (
                        <Badge tone='success'>Checked-in</Badge>
                      ) : ticket.status === 'canceled' ? (
                        <Badge tone='warn'>Canceled</Badge>
                      ) : (
                        <Badge tone='neutral'>Booked</Badge>
                      )}
                    </td>
                    <td className='px-3 py-3 text-gray-300'>{formatCheckedIn(ticket.checked_in_at)}</td>
                    <td className='px-3 py-3'>
                      <div className='flex items-center justify-end gap-2'>
                        <button
                          type='button'
                          className='inline-flex items-center gap-1 rounded-full bg-gray-800 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 focus:ring-offset-gray-900'
                          onClick={() => {
                            navigate(path.my_ticket_details.replace(':id', ticket.id))
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
