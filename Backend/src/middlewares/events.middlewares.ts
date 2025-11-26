import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { EVENTS_MESSAGES } from '~/constants/messages'
import { EventStatus } from '~/types/domain'
import { isValidUUIDv4 } from '~/utils/uuid'
import { Request, Response } from 'express'
import { NextFunction } from 'express-serve-static-core'

import ErrorWithStatus from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import databaseService from '~/services/database.services'
import LIMIT_MIN_MAX from '~/constants/limits'
import Event from '~/models/schemas/Event.schema'

const event_statuts: EventStatus[] = ['draft', 'published', 'canceled']

// Validator for creating an event with field type checks, length limits, and logical constraints
export const createEventValidator = validate(
  checkSchema(
    {
      title: {
        trim: true,
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
        }
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

export const updateEventValidator = validate(
  checkSchema(
    {
      title: {
        trim: true,
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
        }
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
      }
    },
    ['body']
  )
)

export const paginationValidator = validate(
  checkSchema(
    {
      limit: {
        isNumeric: true,
        custom: {
          options: async (value, { req }) => {
            const num = Number(value)
            if (num > LIMIT_MIN_MAX.EVENT_PER_PAGE_MAX || num < LIMIT_MIN_MAX.EVENT_PER_PAGE_MIN) {
              throw new Error(EVENTS_MESSAGES.EVENTS_LENGTH_PER_PAGE_IS_BETWEEN_1_AND_50)
            }
          }
        }
      },
      page: {
        isNumeric: true,
        custom: {
          options: async (values, { req }) => {
            const num = Number(values)
            if (num < 1) {
              throw new Error(EVENTS_MESSAGES.NUMBER_OF_PAGE_MUST_BE_GREATER_THAN_0)
            }
          }
        }
      }
    },
    ['query']
  )
)

export const searchValidator = validate(
  checkSchema(
    {
      q: {
        optional: { options: { nullable: true } },
        isString: {
          errorMessage: EVENTS_MESSAGES.SEARCH_MUST_BE_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: LIMIT_MIN_MAX.SEARCH_MIN,
            max: LIMIT_MIN_MAX.SEARCH_MAX
          },
          errorMessage: EVENTS_MESSAGES.MAXIMUM_SEARCH_LENGTH_MUST_BE_BETWEEN_3_AND_20
        }
      }
    },
    ['query']
  )
)

export const eventIdValidator = validate(
  checkSchema(
    {
      event_id: {
        custom: {
          options: async (values, { req }) => {
            if (!isValidUUIDv4(values)) {
              throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: EVENTS_MESSAGES.INVALID_EVENT_ID
              })
            }
            const event = await databaseService.events(
              `SELECT id, title, description, poster_url, location_text, start_at, end_at, price_cents, checked_in, capacity, status FROM events WHERE id=$1`,
              [values]
            )
            if (event.rows.length <= 0) {
              throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: EVENTS_MESSAGES.EVENT_NOT_FOUND
              })
            }
            req.event = event.rows
            return true
          }
        }
      }
    },
    ['params', 'body']
  )
)

export const changeEventStatusValidator =
  (allowedStatus: string, errorMessage: string, httpStatus: number) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const events = req.event as Event[]
    const event = events[0]
    if (event.status != allowedStatus) {
      return next(
        new ErrorWithStatus({
          message: errorMessage,
          status: httpStatus
        })
      )
    }
    next()
  }
export const getEventStatusValidator = validate(
  checkSchema(
    {
      status: {
        optional: { options: { nullable: true } },
        isIn: {
          options: [event_statuts],
          errorMessage: EVENTS_MESSAGES.EVENT_STATUS_MUST_BE_DRAFT_PUBLISHED_CANCELED
        }
      }
    },
    ['query']
  )
)

export const updateEventStatusValidator = changeEventStatusValidator(
  'draft',
  EVENTS_MESSAGES.CHANGE_EVENT_ONLY_ALLOWED_ON_DRAFT,
  HTTP_STATUS.CONFLICT
)

export const publishEventStatusValidator = changeEventStatusValidator(
  'draft',
  EVENTS_MESSAGES.PUBLISH_EVENT_ONLY_ALLOWED_ON_DRAFT,
  HTTP_STATUS.CONFLICT
)

export const cancelEventStatusValidator = changeEventStatusValidator(
  'published',
  EVENTS_MESSAGES.CANCEL_EVENT_ONLY_ALLOWED_ON_PUBLISHED,
  HTTP_STATUS.CONFLICT
)

export const getPublishedEventStatusValidator = changeEventStatusValidator(
  'published',
  EVENTS_MESSAGES.GET_EVENT_DETAILS_IS_ONLY_ON_PUBLISHED,
  HTTP_STATUS.CONFLICT
)
