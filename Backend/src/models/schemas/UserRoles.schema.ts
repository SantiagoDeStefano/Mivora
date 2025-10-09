import { UUIDv4 } from '~/types/common'
import { UserRole } from '~/types/domain'
import pg from 'pg'

export interface UserRoles extends pg.QueryResultRow {
  id?: UUIDv4
  role: UserRole
}
