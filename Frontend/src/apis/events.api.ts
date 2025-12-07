import { SuccessResponse } from 'src/types/response.types'
import http from '../utils/http'

export interface Event {
  id: string
  organizer_id: string
  title: string
  description?: string
  poster_url?: string
  location_text: string
  start_at: string
  end_at: string
  price_cents: number
  checked_in?: number
  capacity: number
  status: 'draft' | 'published' | 'canceled'
  revenue_cents: number
}

export interface CreateEventPayload {
  title: string
  description: string
  poster_url?: string
  location_text: string
  start_at: string
  end_at: string
  price_cents: number
  capacity: number
}

export interface GetEventsResponse {
  events: Event[]
  limit: number
  page: number
  total_page: number
}

const eventsApi = {
  getEvents: (limit: number = 20, page: number = 1) => {
    return http.get<SuccessResponse<GetEventsResponse>>('/api/v1/events', {
      params: { limit, page }
    })
  },
  getEventDetails: (event_id: string) => {
    return http.get<SuccessResponse<Event>>(`/api/v1/events/${event_id}`)
  },
  searchEvents: (q: string, limit: number = 20, page: number = 1) => {
    return http.get<SuccessResponse<GetEventsResponse>>('/api/v1/events', {
      params: { q, limit, page }
    })
  },
  createEvent: (payload: CreateEventPayload) => {
    return http.post('/api/v1/events', payload)
  },

  uploadEventPoster: (file: File) => {
    const formData = new FormData()
    formData.append('image', file)

    return http.post('/api/v1/medias/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  updateEvent: (event_id: string, body: any) => {
    return http.patch<SuccessResponse<Event>>(`/api/v1/events/${event_id}`, body)
  },
  publishEvent: (event_id: string) => {
    return http.patch<SuccessResponse<Event>>(`/api/v1/events/${event_id}/status`, { status: 'published' })
  },
  cancelEvent: (event_id: string) => {
    return http.patch<SuccessResponse<Event>>(`/api/v1/events/${event_id}/status`, { status: 'canceled' })
  },
  draftEvent: (event_id: string) => {
    return http.patch<SuccessResponse<Event>>(`/api/v1/events/${event_id}/status`, { status: 'draft' })
  }
}

export default eventsApi
