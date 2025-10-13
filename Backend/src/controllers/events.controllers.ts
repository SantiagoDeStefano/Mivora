import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { EVENTS_MESSAGES } from '~/constants/messages'
import { CreateEventRequestBody } from '~/models/requests/events.requests'
import { TokenPayload } from '~/models/requests/users.requests'

import tweetService from '~/services/events.services'

export const createEventController = async (
  req: Request<ParamsDictionary, unknown, CreateEventRequestBody>,
  res: Response
): Promise<void> => {
  const organizer_id = (req.decoded_authorization as TokenPayload).user_id
  const result = await tweetService.createEvent(organizer_id, req.body)
  res.json({
    message: EVENTS_MESSAGES.EVENT_CREATED_SUCCESSFULLY,
    result
  })
}
