import { v4 as uuidv4 } from 'uuid'
import { UUIDv4 } from '~/types/common'

export const newUUIDv4 = (): UUIDv4 => uuidv4() as UUIDv4
