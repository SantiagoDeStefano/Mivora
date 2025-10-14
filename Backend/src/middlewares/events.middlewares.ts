import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { EVENTS_MESSAGES } from '~/constants/messages'
import LIMIT_MIN_MAX from '~/constants/limits'
import { EventStatus } from '~/types/domain'

const event_statuts: EventStatus[] = ['draft', 'published', 'canceled']

// Validator for creating an event with field type checks, length limits, and logical constraints
export const createEventValidator = validate(
  checkSchema(
    {
      title: {
        isString: {
          errorMessage: EVENTS_MESSAGES.EVENT_TITLE_MUST_BE_STRING
        },
        notEmpty: {
          errorMessage: EVENTS_MESSAGES.EVENT_TITLE_IS_REQUIRED
        },
        isLength: {
          options: {
            min: LIMIT_MIN_MAX.EVENT_TITLE_MIN,
            max: LIMIT_MIN_MAX.EVENT_TITLE_MAX
          },
          errorMessage: EVENTS_MESSAGES.EVENT_TITLE_MUST_BE_BETWEEN_6_AND_50
        },
        trim: true
      },
      description: {
        optional: { options: { nullable: true } },
        isString: {
          errorMessage: EVENTS_MESSAGES.EVENT_DESCRIPTION_MUST_BE_STRING
        },
        isLength: {
          options: {
            min: LIMIT_MIN_MAX.EVENT_DESCRIPTION_MIN,
            max: LIMIT_MIN_MAX.EVENT_DESCRIPTION_MAX
          },
          errorMessage: EVENTS_MESSAGES.EVENT_DESCRIPTION_MUST_BE_BETWEEN_10_AND_100
        },
        trim: true
      },
      poster_url: {
        optional: { options: { nullable: true } },
        isString: {
          errorMessage: EVENTS_MESSAGES.EVENT_POSTER_URL_MUST_BE_STRING
        },
        isLength: {
          options: {
            min: LIMIT_MIN_MAX.EVENT_POSTER_URL_MIN,
            max: LIMIT_MIN_MAX.EVENT_POSTER_URL_MAX
          },
          errorMessage: EVENTS_MESSAGES.EVENT_POSTER_URL_MUST_BE_BETWEEN_4_AND_400
        },
        trim: true
      },
      location_text: {
        isString: {
          errorMessage: EVENTS_MESSAGES
        },
        isLength: {
          options: {
            min: LIMIT_MIN_MAX.EVENT_LOCATION_MIN,
            max: LIMIT_MIN_MAX.EVENT_LOCATION_MAX
          },
          errorMessage: EVENTS_MESSAGES
        },
        trim: true
      },
      start_at: {
        isISO8601: {
          options: { strict: true, strictSeparator: true },
          errorMessage: EVENTS_MESSAGES.EVENT_START_AT_MUST_BE_ISO8601
        },
        toDate: true
      },
      end_at: {
        isISO8601: {
          options: { strict: true, strictSeparator: true },
          errorMessage: EVENTS_MESSAGES.EVENT_END_AT_MUST_BE_ISO8601
        },
        custom: {
          options: (value, { req }) => {
            const start = Date.parse(req.body.start_at)
            const end = Date.parse(value)
            // If start is invalid, let the start_at validator report it.
            if (isNaN(start) || isNaN(end)) return true
            return end > start
          },
          errorMessage: EVENTS_MESSAGES.EVENT_END_AT_MUST_BE_AFTER_START_AT
        },
        toDate: true
      },
      price_cents: {
        isNumeric: {
          errorMessage: EVENTS_MESSAGES.EVENT_PRICE_MUST_BE_NUMERIC
        },
        toInt: true,
        custom: {
          options: (value, { req }) => {
            return value > 0
          },
          errorMessage: EVENTS_MESSAGES.EVENT_PRICE_MUST_BE_POSITIVE
        }
      },
      capacity: {
        isNumeric: {
          errorMessage: EVENTS_MESSAGES.EVENT_CAPACITY_MUST_BE_NUMBER
        },
        toInt: true,
        custom: {
          options: (value, { req }) => {
            return value > 0
          },
          errorMessage: EVENTS_MESSAGES.EVENT_CAPACITY_MUST_BE_POSITIVE
        }
      },
      status: {
        optional: { options: { nullable: true } },
        isString: {
          errorMessage: EVENTS_MESSAGES.EVENT_STATUS_MUST_BE_STRING
        },
        isIn: {
          options: [event_statuts],
          errorMessage: EVENTS_MESSAGES.EVENT_STATUS_MUST_BE_DRAFT_PUBLISHED_CANCELED
        }
      }
    },
    ['body']
  )
)
