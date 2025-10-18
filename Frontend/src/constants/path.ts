const path = {
  // Public pages
  home: '/',
  explore: '/explore',
  event_details: '/events/:id',

  // User pages
  profile: '/profile',
  tickets: '/tickets',
  login: '/login',
  signup: '/signup',
  logout: '/logout',

  // Organizer pages
  organizer_dashboard: '/organizer',
  organizer_create_event: '/organizer/create-event',
  organizer_manage_event: '/organizer/events/:eventId',
  organizer_scanner: '/organizer/scanner',
} as const;

export default path;
