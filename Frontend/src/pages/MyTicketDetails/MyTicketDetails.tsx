import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Container from '../../components/Container/Container'
import path from '../../constants/path'

type Ticket = {
  id: string
  title: string
  user_id: string
  status: string
  checked_in_at: string | null
  price_cents: number
  qr_code: string
}

// NOTE: using same mock as MyTickets for local dev
const MOCK: Ticket[] = [
  {
    id: 'f5d09842-e566-4eb6-9a1f-59cbf8db712c',
    title: 'Tech Summit 2025',
    user_id: '88945d98-a228-42fe-89c8-f82c20bfc808',
    status: 'booked',
    checked_in_at: null,
    price_cents: 2500,
    qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASQAAAEkCAYAAACG+Uzs...'
  },
  {
    id: 'a1b2c3d4-e566-4eb6-9a1f-111111111111',
    title: 'Design Workshop',
    user_id: '88945d98-a228-42fe-89c8-f82c20bfc808',
    status: 'checked_in',
    checked_in_at: '2025-11-20T09:15:00.000Z',
    price_cents: 0,
    qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASQAAAEkCAYAAACG+Uzs...'
  },
  {
    id: 'a1b2c3d4-e566-4eb6-9a1f-111111111111',
    title: 'Design Workshop',
    user_id: '88945d98-a228-42fe-89c8-f82c20bfc808',
    status: 'checked_in',
    checked_in_at: '2025-11-20T09:15:00.000Z',
    price_cents: 0,
    qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASQAAAEkCAYAAACG+Uzs...'
  },
    {
    id: 'a1b2c3d4-e566-4eb6-9a1f-111111111111',
    title: 'Design Workshop',
    user_id: '88945d98-a228-42fe-89c8-f82c20bfc808',
    status: 'checked_in',
    checked_in_at: '2025-11-20T09:15:00.000Z',
    price_cents: 0,
    qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASQAAAEkCAYAAACG+Uzs...'
  },
    {
    id: 'a1b2c3d4-e566-4eb6-9a1f-111111111111',
    title: 'Design Workshop',
    user_id: '88945d98-a228-42fe-89c8-f82c20bfc808',
    status: 'checked_in',
    checked_in_at: '2025-11-20T09:15:00.000Z',
    price_cents: 0,
    qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASQAAAEkCAYAAACG+Uzs...'
  } 
]

export default function MyTicketDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  // Scroll-reel behavior: when the route `id` changes scroll to the matching ticket panel.
  useEffect(() => {
    if (!id) {
      // If no id in route, default to the first ticket so there's an active panel.
      if (MOCK.length > 0) {
        navigate(path.my_ticket_details.replace(':id', MOCK[0].id), { replace: true })
      }
      return
    }

    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })

    const onKey = (e: KeyboardEvent) => {
      const idx = MOCK.findIndex((t) => t.id === id)
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (idx >= 0 && idx < MOCK.length - 1) {
          navigate(path.my_ticket_details.replace(':id', MOCK[idx + 1].id))
        }
      }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (idx > 0) {
          navigate(path.my_ticket_details.replace(':id', MOCK[idx - 1].id))
        }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [id, navigate])

  const formatPrice = (price_cents: number) => {
    const value = price_cents / 100
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  }

  const formatCheckedIn = (iso: string | null) => {
    if (!iso) return 'Not checked in'
    try {
      const d = new Date(iso)
      return d.toLocaleString()
    } catch {
      return iso
    }
  }

  return (
    <section className="py-6">
      <Container>
        <div className="max-w-2xl mx-auto">
          {MOCK.map((t) => {
            const active = t.id === id
            return (
              <div id={t.id} key={t.id} className={`min-h-screen flex items-center py-8 ${active ? '' : 'opacity-60'}`}>
                <div className={`w-full bg-white rounded-2xl shadow-sm border border-slate-600 px-6 py-8 transition-transform duration-300 ${active ? 'scale-100 ring-4 ring-pink-100' : 'scale-95'}`}>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h1 className="text-3xl font-semibold text-slate-300">{t.title}</h1>
                      <p className="mt-1 text-xl text-slate-300">Price: {formatPrice(t.price_cents)}</p>
                      <p className="mt-2 text-xm text-slate-500">Checked in: {formatCheckedIn(t.checked_in_at)}</p>
                    </div>
                    <div className="w-44">
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-center">
                        <img src={t.qr_code} alt="Ticket QR" className="w-36 h-36 object-contain" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <div>
                      <button onClick={() => navigate(-1)} className="rounded-full border border-slate-500 px-4 py-2">Back</button>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-sm text-slate-400 self-center">Use ↑ / ↓ to switch</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
