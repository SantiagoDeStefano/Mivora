
const path = {
  home: '/',
  event_details: '/events/:id',
  tickets: '/tickets',
  profile: '/profile',
  login: '/login',
  signup: '/signup',
  organizer_dashboard: '/organizer/dashboard',
  organizer_create_event: '/organizer/create-event',
  organizer_manage_event: '/organizer/events/:eventId',
  organizer_scanner: '/organizer/scanner'
} as const

export default path
