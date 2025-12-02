
const path = {
  home: '/',

  login: '/users/login',
  register: '/users/register',
  forgot_password: '/users/forgot-password',
  reset_password: '/users/reset-password',
  logout: '/users/logout',
  about: '/about',
  
  profile: '/users/me',
  update_profile: '/users/me',

  event_details: '/events/:event_id',
  email_verification: '/users/verify-email',
  forgot_password_verification: '/users/verify-forgot-password',
  search_events: '/search',
  
  organizer_create_event: '/organizer/create-event',
  organizer_created_event_details: '/events/organizer/:id',
  organizer_manage_event: '/events/organizer',
  organizer_update_event: '/events/organizer/:id/edit',
  organizer_publish_event: '/events/organizer/:id/publish',
  organizer_cancel_event: '/events/organizer/:id/cancel',

  my_tickets: '/tickets',
  my_ticket_details: '/tickets/:id',
  book_ticket: '/tickets/book',
  scan_ticket: '/tickets/scan'
} as const

export default path
