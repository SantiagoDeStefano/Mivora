import { SuccessResponse } from 'src/types/response.types'
import http from '../utils/http'

export type EventStatus = 'draft' | 'published' | 'canceled'

export interface Event {
  id: string
  organizer_id: string
  organizer_name: string
  title: string
  description?: string
  poster_url?: string
  location_text: string
  start_at: string
  end_at: string
  price_cents: number
  checked_in?: number
  capacity: number
  status: EventStatus
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

export interface UpdateEventPayload {
  title?: string
  description?: string
  poster_url?: string
  location_text?: string
  start_at?: string
  end_at?: string
  price_cents?: number
  capacity?: number
  status?: EventStatus
}

export interface GetEventsResponse {
  events: Event[]
  limit: number
  page: number
  total_page: number
}

export interface EventMessageApi {
  id: string
  content: string
  created_at: string
  user_id: string
  user_name: string
  user_avatar_url: string | null
  total_count: string
}

export interface GetEventMessagesResult {
  messages: EventMessageApi[]
  limit: number
  page: number
  total_page: number
}

export interface CreateEventMessageResult {
  content: string
  created_at: string
}

export interface UploadMediaResult {
  url: string
}

// Constants để match với messages
const MIN_LIMIT = 1
const MAX_LIMIT = 50
const MIN_SEARCH_LEN = 3
const MAX_SEARCH_LEN = 20

const validatePagination = (limit: number, page: number) => {
  if (limit < MIN_LIMIT || limit > MAX_LIMIT) {
    throw new Error('Maximum events per page is between 1 and 50')
  }

  if (page <= 0) {
    throw new Error('Number of page must be greater than 0')
  }
}

const validateSearch = (search: unknown) => {
  if (typeof search !== 'string') {
    throw new Error('Search values must be string')
  }

  const len = search.trim().length
  if (len < MIN_SEARCH_LEN || len > MAX_SEARCH_LEN) {
    throw new Error('Search length must be between 3 and 20')
  }
}

const eventsApi = {
  getEvents: (limit: number = 20, page: number = 1) => {
    validatePagination(limit, page)

    return http.get<SuccessResponse<GetEventsResponse>>('/events', {
      params: { limit, page }
    })
  },

  getEventDetails: (event_id: string) => {
    return http.get<SuccessResponse<Event>>(`/events/${event_id}`)
  },

  searchEvents: (q: string, limit: number = 20, page: number = 1) => {
    validateSearch(q)
    validatePagination(limit, page)

    return http.get<SuccessResponse<GetEventsResponse>>('/events', {
      params: { q, limit, page }
    })
  },
  createEvent: (payload: CreateEventPayload) => {
    return http.post<SuccessResponse<Event>>('/events', payload)
  },

  uploadEventPoster: (eventId: string, formData: FormData) => {
    return http.put<SuccessResponse<UploadMediaResult>>(
      `/events/${eventId}/poster`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    )
  },

  getCreatedEventDetails: (event_id: string) => {
    return http.get<SuccessResponse<Event>>(`/users/me/events/${event_id}`)
  },

  updateEvent: (event_id: string, body: UpdateEventPayload) => {
    return http.patch<SuccessResponse<Event>>(`/events/${event_id}`, body)
  },

  publishEvent: (event_id: string) => {
    return http.patch<SuccessResponse<Event>>(`/events/${event_id}/status`, {
      status: 'published' as EventStatus
    })
  },

  cancelEvent: (event_id: string) => {
    return http.patch<SuccessResponse<Event>>(`/events/${event_id}/status`, {
      status: 'canceled' as EventStatus
    })
  },

  draftEvent: (event_id: string) => {
    return http.patch<SuccessResponse<Event>>(`/events/${event_id}/status`, {
      status: 'draft' as EventStatus
    })
  },
  getEventMessages: (event_id: string, limit: number = 20, page: number = 1) => {
    return http.get<SuccessResponse<GetEventMessagesResult>>(`/events/${event_id}/messages`, {
      params: { limit, page }
    })
  },
  createEventMessage: (event_id: string, content: string) => {
    return http.post<SuccessResponse<CreateEventMessageResult>>(`/events/${event_id}/messages`, { content })
  }
}

export default eventsApi
