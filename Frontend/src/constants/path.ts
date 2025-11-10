
const path = {
  home: '/',
  login: '/users/login',
  register: '/users/register',
  profile: '/users/me',
  update_profile: '/users/me/update',

  event_details: '/events/:id',
  attendee_dashboard: '/attendee/dashboard',
  tickets: '/attendee/tickets',

  forgot_password: '/forgot-password',
  organizer_dashboard: '/organizer/dashboard',
  organizer_create_event: '/organizer/create-event',
  organizer_manage_event: '/organizer/events/:eventId',
  organizer_scanner: '/organizer/scanner'
} as const

export default path
