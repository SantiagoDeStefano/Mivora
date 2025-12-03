import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { EVENTS_MESSAGES } from '~/constants/messages'
import {
  CreateEventRequestBody,
  GetCreatedEventDetailsParams,
  SearchEvents,
  SearchEventWithStatus,
  UpdateEventDetailsBody
} from '~/models/requests/events.requests'
import { TokenPayload } from '~/models/requests/users.requests'
import Event from '~/models/schemas/Event.schema'

import eventService from '~/services/events.services'
import { UUIDv4 } from '~/types/common'
import { EventStatus } from '~/types/domain'

export const createEventController = async (
  req: Request<ParamsDictionary, unknown, CreateEventRequestBody>,
  res: Response
): Promise<void> => {
  const organizer_id = (req.decoded_authorization as TokenPayload).user_id
  const result = await eventService.createEvent(organizer_id, req.body)
  res.json({
    message: EVENTS_MESSAGES.EVENT_CREATED_SUCCESSFULLY,
    result
  })
}

export const getOrSearchEventsController = async (
  req: Request<ParamsDictionary, unknown, unknown, SearchEvents>,
  res: Response
): Promise<void> => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const search = req.query.q
  // Easier postman uses, change to published on production
  const eventStatus = 'published' as EventStatus
  const result = await eventService.getOrSearchPublishedEvents(search, limit, page, eventStatus)
  res.json({
    message: EVENTS_MESSAGES.GET_EVENTS_SUCCESSFULLY,
    result: {
      events: result.events,
      limit,
      page,
      total_page: Math.ceil(result.totalEvents / limit)
    }
  })
}

export const getOrSearchEventsWithStatusController = async (
  req: Request<ParamsDictionary, unknown, unknown, SearchEventWithStatus>,
  res: Response
): Promise<void> => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const status = req.query.status
  const search = req.query.q
  const organizer_id = req.decoded_authorization?.user_id as UUIDv4
  const result = await eventService.getOrSearchEventsWithStatus(organizer_id, limit, page, search, status)
  res.json({
    message: EVENTS_MESSAGES.GET_EVENTS_SUCCESSFULLY,
    result: {
      events: result.events,
      limit,
      page,
      total_page: Math.ceil(result.totalEvents / limit)
    }
  })
}

export const getCreatedEventDetailsController = async (
  req: Request<ParamsDictionary, unknown, unknown, GetCreatedEventDetailsParams>,
  res: Response
): Promise<void> => {
  const event_id = req.params.event_id as UUIDv4
  const organizer_id = req.decoded_authorization?.user_id as UUIDv4
  const result = await eventService.getCreatedEventDetails(organizer_id, event_id)
  res.json({
    message: EVENTS_MESSAGES.GET_CREATED_EVENTS_DETAILS_SUCCESSFULLY,
    result
  })
}

export const getEventDetailsController = async (req: Request, res: Response): Promise<void> => {
  const eventData = req.event?.[0]
  const event = {
    ...eventData
  }
  res.json({
    message: EVENTS_MESSAGES.GET_EVENTS_SUCCESSFULLY,
    result: event
  })
}

export const updateEventDetailsController = async (
  req: Request<ParamsDictionary, unknown, UpdateEventDetailsBody>,
  res: Response
): Promise<void> => {
  const event_id = (req.event as Event[])[0].id
  const result = await eventService.updateEvent(event_id, req.body)
  res.json({
    message: EVENTS_MESSAGES.UPDATE_EVENT_SUCCESS,
    result
  })
}

export const publishEventController = async (req: Request, res: Response): Promise<void> => {
  const event_id = (req.event as Event[])[0].id
  const result = await eventService.publishEvent(event_id)
  res.json({
    message: EVENTS_MESSAGES.PUBLISH_EVENT_SUCCESS,
    result
  })
}

export const cancelEventController = async (req: Request, res: Response): Promise<void> => {
  const event_id = (req.event as Event[])[0].id
  const result = await eventService.cancelEvent(event_id)
  res.json({
    message: EVENTS_MESSAGES.CANCEL_EVENT_SUCCESS,
    result
  })
}
