export const USERS_MESSAGES = {
  ACCESS_TOKEN_REQUIRED: 'Access token is required',
  ALREADY_FOLLOWED: 'Already followed',
  ALREADY_UNFOLLOWED: 'Already unfollowed or not following',

  BIO_MUST_BE_A_STRING: 'Bio must be a string',
  BIO_LENGTH_MUST_BE_BETWEEN_1_AND_100: 'Bio must be between 1 and 100',

  CHECK_YOUR_EMAIL_FOR_RESET_PASSWORD_LINK: 'Check your email for reset password link',
  CONFIRM_PASSWORD_DOES_NOT_MATCH_PASSWORD: 'Password confirmation does not match password',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Password confirmation is required',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Password confirmation must be a string',
  CONFIRM_PASSWORD_MUST_BE_FROM_8_TO_24: 'Password confirmation must be between 8 and 24',
  CHANGE_PASSWORD_SUCCESS: 'Change password successfully',

  DATE_OF_BIRTH_IS_REQUIRED: 'Date of birth is required',
  DATE_OF_BIRTH_IS_NOT_VALID: 'Date of birth is not valid',

  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_ALREADY_VERIFIED: 'Email already verified',
  EMAIL_AND_PASSWORD_REQUIRED: 'Email and password are required',
  EMAIL_DOES_NOT_EXIST: 'Email does not exist',
  EMAIL_IS_INVALID: 'Email is invalid',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_VERIFY_SUCCESS: 'Email verified successfully',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email or password is incorrect',
  EVENT_CREATOR_MUST_BE_ORGANIZER: 'Event creator must be organizer',
  MUST_BE_ORGANIZER: 'Must be organizer',

  FORGOT_PASSWORD_TOKEN_REQUIRED: 'Forgot password token is required',
  FOLLOW_SUCCESS: 'Follow successfully',

  GET_ME_SUCCESS: 'Get my profile successfully',
  GET_PROFILE_SUCCESS: 'Get profile successfully',
  GMAIL_NOT_VERIFIED: 'Email is not verified',

  INVALID_FORGOT_PASSWORD_TOKEN: 'Invalid forgot password token',
  IMAGE_URL_MUST_BE_A_STRING: 'Image URL must be a string',
  IMAGE_URL_MUST_BE_BETWEEN_1_AND_400: 'Image URL must be between 1 and 400',
  INVALID_USER_ID: 'Invalid user ID',
  INVALID_USERNAME: 'Username must be between 4-15 characters and contain only letters, numbers, underscore',
  INVALID_EMAIL_VERIFY_TOKEN: 'Invalid email verification token',

  LOGIN_SUCCESS: 'Login successfully',
  LOGOUT_SUCCESS: 'Logout successfully',
  LOCATION_MUST_BE_A_STRING: 'Location must be a string',
  LOCATION_LENGTH_MUST_BE_BETWEEN_1_AND_100: 'Location length must be between 1 and 100',

  NAME_IS_REQUIRED: 'Name is required',
  NAME_LENGTH_MUST_BE_FROM_3_TO_100: 'Name length must be from 3 to 100',
  NAME_MUST_BE_A_STRING: 'Name must be a string',

  OLD_PASSWORD_DOES_NOT_MATCH: 'Old password does not match',
  ONE_USER_PER_EVENT_ONLY: 'One user per event only',

  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_A_STRING: 'Password must be a string',
  PASSWORD_MUST_BE_FROM_8_TO_24: 'Password must be between 8 and 24',
  PASSWORD_MUST_BE_STRONG: 'Password must be strong',

  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
  REGISTER_SUCCESS: 'Register successfully',
  RESEND_VERIFY_EMAIL_SUCCESS: 'Resend verify email successfully',
  RESET_PASSWORD_SUCCESS: 'Reset password successfully',
  REFRESH_TOKEN_SUCCESS: 'New tokens returned successfully',
  ROLE_MUST_BE_ATTENDEE_OR_ORGANIZER: 'Role must be Attendee or organizer',
  ROLE_MUST_BE_A_STRING: 'Role must be a string',
  ROLE_IS_REQUIRED: 'Role is required',

  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Used refresh token or does not exist',
  USER_NOT_FOUND: 'User not found',
  USER_NOT_VERIFIED: 'User not verified',
  USERNAME_MUST_BE_A_STRING: 'Username must be a string',
  USERNAME_MUST_BE_BETWEEN_1_AND_50: 'Username must be between 1 and 50',
  UPDATE_ME_SUCCESS: 'Update me successfully',
  UPDATE_AVATAR_SUCCESS: 'Update avatar successfully',
  UNFOLLOW_SUCCESS: 'Unfollowed successfully',
  USERNAME_ALREADY_EXISTS: 'Username already exists',
  UPDATE_ROLE_MUST_BE_ORGANIZER: 'Update role must be organizer',
  USER_ALREADY_HAVE_THIS_ROLE: 'User already have this role',
  USER_MUST_BE_VERIFIED_TO_BE_ORGANIZER: 'User must be verified to be organizer',

  VALIDATION_ERROR: 'Validation error',
  VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS: 'Verify forgot password token successfully',

  WEBSITE_MUST_BE_A_STRING: 'Website must be a string',
  WEBSITE_LENGTH_MUST_BE_BETWEEN_1_AND_200: 'Website must be between 1 and 200',

  SEND_VERIFY_EMAIL_SUCCESS: 'Send verify email successfully',
  STRONG_PASSWORD:
    'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character'
} as const

export const EVENTS_MESSAGES = {
  CHANGE_EVENT_ONLY_ALLOWED_ON_DRAFT: 'Change event only allowed on draft',
  CANCEL_EVENT_ONLY_ALLOWED_ON_PUBLISHED: 'Cancel event only allowed on published',
  CANCEL_EVENT_SUCCESS: 'Cancel event successfully',

  EVENT_TITLE_IS_REQUIRED: "Event's title is required",
  EVENT_TITLE_MUST_BE_STRING: "Event's title must be string",
  EVENT_TITLE_MUST_BE_BETWEEN_6_AND_50: "Event's title must be between 5 and 60",
  EVENT_DESCRIPTION_MUST_BE_STRING: "Event's description must be string",
  EVENT_DESCRIPTION_MUST_BE_BETWEEN_10_AND_100: "Event's description must be between 10 and 100",
  EVENT_POSTER_URL_MUST_BE_STRING: "Event's poster url must be string",
  EVENT_POSTER_URL_MUST_BE_BETWEEN_4_AND_400: "Event's poster url must be between 4 and 100",
  EVENT_LOCATION_TEXT_IS_REQUIRED: "Event's location text is required",
  EVENT_LOCATION_TEXT_MUST_BE_STRING: "Event's location text must be string",
  EVENT_LOCATION_TEXT_MUST_BE_BETWEEN_5_AND_100: "Event's location text must be between 5 and 100",
  EVENT_START_AT_MUST_BE_ISO8601: "Event's start at must be ISO8601",
  EVENT_END_AT_MUST_BE_ISO8601: "Event's end at must be ISO8601",
  EVENT_END_AT_MUST_BE_AFTER_START_AT: "Event's end at must be after start at",
  EVENT_PRICE_MUST_BE_NUMERIC: "Event's price must be numeric",
  EVENT_PRICE_MUST_BE_POSITIVE: "Event's price must be positive",
  EVENT_CAPACITY_MUST_BE_NUMBER: "Event's capacity must be numeric",
  EVENT_CAPACITY_MUST_BE_POSITIVE: "Event's capacity must be positive",
  EVENT_STATUS_MUST_BE_STRING: "Event's status must be string",
  EVENT_STATUS_MUST_BE_DRAFT_PUBLISHED_CANCELED: "Event's status must be draft, published, or canceled",
  EVENT_CREATED_SUCCESSFULLY: 'Event created successfully',
  EVENT_NOT_FOUND: 'Event not found',

  GET_EVENTS_SUCCESSFULLY: 'Get events successfully',
  GET_CREATED_EVENTS_SUCCESSFULLY: 'Get created events successfully',
  GET_EVENT_DETAILS_IS_ONLY_ON_PUBLISHED: "Get event's details is only on published",

  INVALID_EVENT_ID: 'Invalid EventID',

  MAXIMUM_EVENTS_PER_PAGE_IS_BETWEEN_1_AND_50: 'Maximum events per page is between 1 and 50',
  NUMBER_OF_PAGE_MUST_BE_GREATER_THAN_0: 'Number of page must be greater than 0',

  PUBLISH_EVENT_SUCCESS: 'Publish event successfully',
  PUBLISH_EVENT_ONLY_ALLOWED_ON_DRAFT: 'Publish event only allowed on draft',

  UPDATE_EVENT_SUCCESS: 'Update event successfully'
} as const

export const MEDIAS_MESSAGES = {
  IMAGE_UPLOAD_SUCCESS: 'Image uploaded successfully'
} as const

export const TICKETS_MESSAGES = {
  TICKET_ALREADY_CHECKED_IN: 'Ticket already checked in',
  BOOK_TICKET_SUCCESS: 'Book ticket successfully',

  QR_CODE_TOKEN_REQUIRED: 'QR code token is required',

  TICKET_NOT_FOUND: 'Ticket not found',
  TICKET_SCANNED_SUCCESS: 'Ticket scanned successfully',

  USER_IS_NOT_EVENT_ORGANIZER: "Current user is not event's organizer"
}
