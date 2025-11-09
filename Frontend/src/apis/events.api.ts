// import http from '../utils/http'

// export interface Event {
//   id: string
//   organizer_id: string
//   title: string
//   description?: string
//   poster_url?: string
//   location_text: string
//   start_at: string
//   end_at: string
//   price_cents: number
//   checked_in?: number
//   capacity: number
//   status: 'draft' | 'published' | 'canceled'
// }

// export interface GetEventsResponse {
//   message: string
//   result: {
//     events: Event[]
//     limit: number
//     page: number
//     total_page: number
//   }
// }

// const eventsApi = {
//   getEvents: (limit: number = 10, page: number = 1) => {
//     return http.get<GetEventsResponse>('/events', {
//       params: { limit, page }
//     })
//   }
// }

// export default eventsApi

