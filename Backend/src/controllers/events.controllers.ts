import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { EVENTS_MESSAGES } from '~/constants/messages'
import { CreateEventRequestBody, Pagination } from '~/models/requests/events.requests'
import { TokenPayload } from '~/models/requests/users.requests'

import eventService from '~/services/events.services'

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

export const getEventsController = async (
  req: Request<ParamsDictionary, unknown, unknown, Pagination>,
  res: Response
): Promise<void> => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const result = await eventService.getEvents(limit, page)
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

export const getEventDetailsController = async(
  req: Request<ParamsDictionary, unknown, unknown, Pagination>,
  res: Response
): Promise<void> => {
  const eventData = req.event?.[0]
  res.json({
    eventData
  })
}