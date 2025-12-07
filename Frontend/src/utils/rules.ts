import { EVENTS_MESSAGES, USERS_MESSAGES, TICKETS_MESSAGES, MEDIAS_MESSAGES } from '../constants/messages'
import LIMIT_MIN_MAX from '../constants/limits'
import * as yup from 'yup'

// helper: counts for each character class
const countMatches = (s: string, re: RegExp) => (s.match(re) || []).length

// --- SCHEMAS ---
// These rules was taken from users.middlewaress's registerValidator
export const registerSchema = yup.object({
  name: yup
    .string()
    .required(USERS_MESSAGES.NAME_IS_REQUIRED)
    .min(LIMIT_MIN_MAX.NAME_LENGTH_MIN, USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_3_TO_100)
    .max(LIMIT_MIN_MAX.NAME_LENGTH_MAX, USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_3_TO_100)
    .trim(),
  email: yup
    .string()
    .required(USERS_MESSAGES.EMAIL_IS_REQUIRED)
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, USERS_MESSAGES.EMAIL_IS_INVALID)
    .trim(),
  password: yup
    .string()
    .required(USERS_MESSAGES.PASSWORD_IS_REQUIRED)
    .min(LIMIT_MIN_MAX.PASSWORD_LENGTH_MIN, USERS_MESSAGES.PASSWORD_MUST_BE_FROM_8_TO_24)
    .max(LIMIT_MIN_MAX.PASSWORD_LENGTH_MAX, USERS_MESSAGES.PASSWORD_MUST_BE_FROM_8_TO_24)
    .test(
      'strong-password',
      USERS_MESSAGES.STRONG_PASSWORD, // one generic message like backend
      (value) => {
        if (!value) return false

        const {
          STRONG_PASSWORD_MIN_LENGTH,
          STRONG_PASSWORD_MIN_LOWERCASE,
          STRONG_PASSWORD_MIN_UPPERCASE,
          STRONG_PASSWORD_MIN_NUMBER,
          STRONG_PASSWORD_MIN_SYMBOL
        } = LIMIT_MIN_MAX

        // if you want to enforce the "strong" min length independently of .min/.max:
        if (value.length < STRONG_PASSWORD_MIN_LENGTH) return false

        const lowers = countMatches(value, /[a-z]/g)
        const uppers = countMatches(value, /[A-Z]/g)
        const numbers = countMatches(value, /\d/g)
        const symbols = countMatches(value, /[^A-Za-z0-9]/g) // like validator.js: “symbols” = non-alphanumeric

        return (
          lowers >= STRONG_PASSWORD_MIN_LOWERCASE &&
          uppers >= STRONG_PASSWORD_MIN_UPPERCASE &&
          numbers >= STRONG_PASSWORD_MIN_NUMBER &&
          symbols >= STRONG_PASSWORD_MIN_SYMBOL
        )
      }
    ),
  confirm_password: yup
    .string()
    .required(USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED)
    .min(LIMIT_MIN_MAX.PASSWORD_LENGTH_MIN, USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_FROM_8_TO_24)
    .max(LIMIT_MIN_MAX.PASSWORD_LENGTH_MAX, USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_FROM_8_TO_24)
    .oneOf([yup.ref('password')], USERS_MESSAGES.CONFIRM_PASSWORD_DOES_NOT_MATCH_PASSWORD)
})

export const loginSchema = yup.object({
  email: yup
    .string()
    .required(USERS_MESSAGES.EMAIL_IS_REQUIRED)
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, USERS_MESSAGES.EMAIL_IS_INVALID)
    .trim(),
  password: yup
    .string()
    .required(USERS_MESSAGES.PASSWORD_IS_REQUIRED)
    .min(LIMIT_MIN_MAX.PASSWORD_LENGTH_MIN, USERS_MESSAGES.PASSWORD_MUST_BE_FROM_8_TO_24)
    .max(LIMIT_MIN_MAX.PASSWORD_LENGTH_MAX, USERS_MESSAGES.PASSWORD_MUST_BE_FROM_8_TO_24)
})

export const updateMe = yup.object({
  name: yup
    .string()
    .required(USERS_MESSAGES.NAME_IS_REQUIRED)
    .min(LIMIT_MIN_MAX.NAME_LENGTH_MIN, USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_3_TO_100)
    .max(LIMIT_MIN_MAX.NAME_LENGTH_MAX, USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_3_TO_100)
    .trim(),
  role: yup.string().oneOf(['attendee', 'organizer'])
})


export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required(USERS_MESSAGES.PASSWORD_IS_REQUIRED)
    .min(LIMIT_MIN_MAX.PASSWORD_LENGTH_MIN, USERS_MESSAGES.PASSWORD_MUST_BE_FROM_8_TO_24)
    .max(LIMIT_MIN_MAX.PASSWORD_LENGTH_MAX, USERS_MESSAGES.PASSWORD_MUST_BE_FROM_8_TO_24)
    .test(
      'strong-password',
      USERS_MESSAGES.STRONG_PASSWORD, // one generic message like backend
      (value) => {
        if (!value) return false

        const {
          STRONG_PASSWORD_MIN_LENGTH,
          STRONG_PASSWORD_MIN_LOWERCASE,
          STRONG_PASSWORD_MIN_UPPERCASE,
          STRONG_PASSWORD_MIN_NUMBER,
          STRONG_PASSWORD_MIN_SYMBOL
        } = LIMIT_MIN_MAX

        // if you want to enforce the "strong" min length independently of .min/.max:
        if (value.length < STRONG_PASSWORD_MIN_LENGTH) return false

        const lowers = countMatches(value, /[a-z]/g)
        const uppers = countMatches(value, /[A-Z]/g)
        const numbers = countMatches(value, /\d/g)
        const symbols = countMatches(value, /[^A-Za-z0-9]/g) // like validator.js: “symbols” = non-alphanumeric

        return (
          lowers >= STRONG_PASSWORD_MIN_LOWERCASE &&
          uppers >= STRONG_PASSWORD_MIN_UPPERCASE &&
          numbers >= STRONG_PASSWORD_MIN_NUMBER &&
          symbols >= STRONG_PASSWORD_MIN_SYMBOL
        )
      }
    ),
  confirm_password: yup
    .string()
    .required(USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED)
    .min(LIMIT_MIN_MAX.PASSWORD_LENGTH_MIN, USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_FROM_8_TO_24)
    .max(LIMIT_MIN_MAX.PASSWORD_LENGTH_MAX, USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_FROM_8_TO_24)
    .oneOf([yup.ref('password')], USERS_MESSAGES.CONFIRM_PASSWORD_DOES_NOT_MATCH_PASSWORD)
})

export const createEvent = yup.object({
  title: yup
    .string()
    .required(EVENTS_MESSAGES.EVENT_TITLE_IS_REQUIRED)
    .min(
      LIMIT_MIN_MAX.EVENT_TITLE_MIN,
      EVENTS_MESSAGES.EVENT_TITLE_MUST_BE_BETWEEN_6_AND_50
    )
    .max(
      LIMIT_MIN_MAX.EVENT_TITLE_MAX,
      EVENTS_MESSAGES.EVENT_TITLE_MUST_BE_BETWEEN_6_AND_50
    )
    .trim(),

  description: yup
    .string()
    .required(EVENTS_MESSAGES.EVENT_DESCRIPTION_MUST_BE_BETWEEN_10_AND_100)
    .min(
      LIMIT_MIN_MAX.EVENT_DESCRIPTION_MIN,
      EVENTS_MESSAGES.EVENT_DESCRIPTION_MUST_BE_BETWEEN_10_AND_100
    )
    .max(
      LIMIT_MIN_MAX.EVENT_DESCRIPTION_MAX,
      EVENTS_MESSAGES.EVENT_DESCRIPTION_MUST_BE_BETWEEN_10_AND_100
    )
    .trim(),

  poster_url: yup
    .string()
    .trim()
    .notRequired()
    .min(
      LIMIT_MIN_MAX.EVENT_POSTER_URL_MIN,
      EVENTS_MESSAGES.EVENT_POSTER_URL_MUST_BE_BETWEEN_4_AND_400
    )
    .max(
      LIMIT_MIN_MAX.EVENT_POSTER_URL_MAX,
      EVENTS_MESSAGES.EVENT_POSTER_URL_MUST_BE_BETWEEN_4_AND_400
    ),

  location_text: yup
    .string()
    .required(EVENTS_MESSAGES.EVENT_LOCATION_TEXT_IS_REQUIRED)
    .min(
      LIMIT_MIN_MAX.EVENT_LOCATION_MIN,
      EVENTS_MESSAGES.EVENT_LOCATION_TEXT_MUST_BE_BETWEEN_5_AND_100
    )
    .max(
      LIMIT_MIN_MAX.EVENT_LOCATION_MAX,
      EVENTS_MESSAGES.EVENT_LOCATION_TEXT_MUST_BE_BETWEEN_5_AND_100
    )
    .trim(),

  start_at: yup
    .date()
    .typeError(EVENTS_MESSAGES.EVENT_START_AT_MUST_BE_ISO8601)
    .required(EVENTS_MESSAGES.EVENT_START_AT_IS_REQUIRED),

  end_at: yup
    .date()
    .typeError(EVENTS_MESSAGES.EVENT_END_AT_MUST_BE_ISO8601)
    .required(EVENTS_MESSAGES.EVENT_END_AT_IS_REQUIRED)
    .min(
      yup.ref('start_at'),
      EVENTS_MESSAGES.EVENT_END_AT_MUST_BE_AFTER_START_AT
    ),

  price_cents: yup
    .number()
    .typeError(EVENTS_MESSAGES.EVENT_PRICE_MUST_BE_NUMERIC)
    .required(EVENTS_MESSAGES.EVENT_PRICE_MUST_BE_NUMERIC)
    .min(0, EVENTS_MESSAGES.EVENT_PRICE_MUST_BE_POSITIVE)
    .integer(EVENTS_MESSAGES.EVENT_PRICE_MUST_BE_NUMERIC),

  capacity: yup
    .number()
    .typeError(EVENTS_MESSAGES.EVENT_CAPACITY_MUST_BE_NUMBER)
    .required(EVENTS_MESSAGES.EVENT_CAPACITY_MUST_BE_NUMBER)
    .min(1, EVENTS_MESSAGES.EVENT_CAPACITY_MUST_BE_POSITIVE)
    .integer(EVENTS_MESSAGES.EVENT_CAPACITY_MUST_BE_NUMBER)
})

export const uploadEventPoster = yup.object({
  image: yup
    .mixed()
    .required(MEDIAS_MESSAGES.IMAGE_IS_REQUIRED)
    .test('fileType', MEDIAS_MESSAGES.IMAGE_TYPE_IS_NOT_VALID, (value) => {
      if (!value) return false
      return value instanceof File && value.type.startsWith('image/')
    })
    .test('fileSize', MEDIAS_MESSAGES.IMAGE_MUST_BE_LESS_THAN_5MB, (value) => {
      if (!value) return false
      return value instanceof File && value.size <= 5000 * 1024
    })
})

export const updateEvent = yup.object({
  title: yup
    .string()
    .trim()
    .min(LIMIT_MIN_MAX.EVENT_TITLE_MIN, EVENTS_MESSAGES.EVENT_TITLE_MUST_BE_BETWEEN_6_AND_50)
    .max(LIMIT_MIN_MAX.EVENT_TITLE_MAX, EVENTS_MESSAGES.EVENT_TITLE_MUST_BE_BETWEEN_6_AND_50),
  description: yup
    .string()
    .min(LIMIT_MIN_MAX.EVENT_DESCRIPTION_MIN, EVENTS_MESSAGES.EVENT_DESCRIPTION_MUST_BE_BETWEEN_10_AND_100)
    .max(LIMIT_MIN_MAX.EVENT_DESCRIPTION_MAX, EVENTS_MESSAGES.EVENT_DESCRIPTION_MUST_BE_BETWEEN_10_AND_100)
    .trim(),
  poster_url: yup
    .string()
    .min(LIMIT_MIN_MAX.EVENT_POSTER_URL_MIN, EVENTS_MESSAGES.EVENT_POSTER_URL_MUST_BE_BETWEEN_4_AND_400)
    .max(LIMIT_MIN_MAX.EVENT_POSTER_URL_MAX, EVENTS_MESSAGES.EVENT_POSTER_URL_MUST_BE_BETWEEN_4_AND_400)
    .trim(),
  location_text: yup
    .string()
    .min(LIMIT_MIN_MAX.EVENT_LOCATION_MIN, EVENTS_MESSAGES.EVENT_LOCATION_TEXT_MUST_BE_BETWEEN_5_AND_100)
    .max(LIMIT_MIN_MAX.EVENT_LOCATION_MAX, EVENTS_MESSAGES.EVENT_LOCATION_TEXT_MUST_BE_BETWEEN_5_AND_100)
    .trim(),
  start_at: yup
    .string()
    .matches(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
      EVENTS_MESSAGES.EVENT_START_AT_MUST_BE_ISO8601
    )
    .transform((value) => new Date(value)),
    end_at: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, EVENTS_MESSAGES.EVENT_END_AT_MUST_BE_ISO8601)
    .transform((value) => new Date(value))
    .test(
      'end-at-after-start-at',
      EVENTS_MESSAGES.EVENT_END_AT_MUST_BE_AFTER_START_AT,
      function (value) {
        const { start_at } = this.parent
        if (!start_at) return true
        return value > start_at
      }
    ),
    
  price_cents: yup.number().min(0, 'Price must be non-negative'),
  capacity: yup.number().min(0, 'Capacity must be non-negative')
})

export const updateEventPoster = yup.object({
  image: yup
    .mixed()
    .test('fileType', MEDIAS_MESSAGES.IMAGE_TYPE_IS_NOT_VALID, (value) => {
      if (!value) return false
      return value instanceof File && value.type.startsWith('image/')
    })
    .test('fileSize', MEDIAS_MESSAGES.IMAGE_MUST_BE_LESS_THAN_5MB, (value) => {
      if (!value) return false
      return value instanceof File && value.size <= 5000 * 1024
    })
})

export const publishEvent = yup.object({
  status: yup.string().oneOf(['draft'])
})

export const cancelEvent = yup.object({
  status: yup.string().oneOf(['published'])
})

export const bookTicket = yup.object({
  event_id: yup
    .string()
    .trim()
    .required(EVENTS_MESSAGES.INVALID_EVENT_ID)
    .matches(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      EVENTS_MESSAGES.INVALID_EVENT_ID
    )
})

export const getOrSearchMyTickets = yup.object({
  limit: yup
    .number()
    .integer()
    .min(LIMIT_MIN_MAX.EVENT_PER_PAGE_MIN, EVENTS_MESSAGES.EVENTS_LENGTH_PER_PAGE_IS_BETWEEN_1_AND_50)
    .max(LIMIT_MIN_MAX.EVENT_PER_PAGE_MAX, EVENTS_MESSAGES.EVENTS_LENGTH_PER_PAGE_IS_BETWEEN_1_AND_50)
    .optional(),
  page: yup.number().integer().min(1, EVENTS_MESSAGES.NUMBER_OF_PAGE_MUST_BE_GREATER_THAN_0).optional(),
  status: yup
    .string()
    .oneOf(['booked', 'checked_in', 'canceled'], TICKETS_MESSAGES.TICKET_STATUS_MUST_BE_BOOKED_CHECKED_IN)
    .optional(),
  q: yup
    .string()
    .trim()
    .min(3, EVENTS_MESSAGES.MAXIMUM_SEARCH_LENGTH_MUST_BE_BETWEEN_3_AND_20)
    .max(20, EVENTS_MESSAGES.MAXIMUM_SEARCH_LENGTH_MUST_BE_BETWEEN_3_AND_20)
    .optional()
})

export const getTicketDetails = yup.object({
  ticket_id: yup
    .string()
    .trim()
    .required(TICKETS_MESSAGES.TICKET_NOT_FOUND)
    .matches(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      TICKETS_MESSAGES.TICKET_NOT_FOUND
    )
    .transform((value) => value.toLowerCase())
})

export const scanTicket = yup.object({
  qr_code_token: yup.string().required(TICKETS_MESSAGES.QR_CODE_TOKEN_REQUIRED)
  .trim()
})

// --- TYPES ---
export type RegisterSchema = Required<yup.InferType<typeof registerSchema>>
export type LoginSchema = Required<yup.InferType<typeof loginSchema>>

export type UpdateMeSchema = yup.InferType<typeof updateMe>
export type ResetPasswordSchema = Required<yup.InferType<typeof resetPasswordSchema>>

export type CreateEventSchema = yup.InferType<typeof createEvent>
export type UploadEventPosterSchema = yup.InferType<typeof uploadEventPoster>
export type UpdateEventSchema = yup.InferType<typeof updateEvent>
export type UpdateEventPosterSchema = yup.InferType<typeof updateEventPoster>
export type PublishEventSchema = yup.InferType<typeof publishEvent>
export type CancelEventSchema = yup.InferType<typeof cancelEvent>

export type BookTicketSchema = Required<yup.InferType<typeof bookTicket>>
export type GetOrSearchMyTicketsSchema = yup.InferType<typeof getOrSearchMyTickets>
