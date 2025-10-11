import { UUIDv4 } from '~/types/common'
import { UserRole } from '~/types/domain'
import pg from 'pg'

export interface UserRolesType extends pg.QueryResultRow {
  id?: UUIDv4
  role: UserRole
}
