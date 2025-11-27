
const path = {
  home: '/',

  login: '/users/login',
  register: '/users/register',
  forgot_password: '/users/forgot-password',
  reset_password: '/users/reset-password',
  logout: '/users/logout',

  profile: '/users/me',
  update_profile: '/users/me',

  event_details: '/events/:id',
  attendee_dashboard: '/attendee/dashboard',
  my_tickets: '/attendee/tickets',

  organizer_dashboard: '/organizer/dashboard',

  organizer_create_event: '/organizer/create-event',
  organizer_manage_event: '/events/organizer',
  organizer_scanner: '/organizer/scanner'
} as const

export default path
