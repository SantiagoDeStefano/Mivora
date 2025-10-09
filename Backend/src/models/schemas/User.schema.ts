import { UUIDv4 } from '~/types/common'
import { newUUIDv4 } from '~/utils/uuid'
import { UserRole } from '~/types/domain'
import pg from 'pg'

interface UserType extends pg.QueryResultRow {
  id?: UUIDv4
  name: string
  email: string
  password_hash: string
  forgot_password_token?: string
  role?: UserRole[]
  avatar_url?: string
  created_at?: Date
  updated_at?: Date
}

export default class User {
  id: UUIDv4
  name: string
  email: string
  password_hash: string
  forgot_password_token: string
  role: UserRole[]
  avatar_url: string
  created_at: Date
  updated_at: Date

  constructor(user: UserType) {
    this.id = user.id || newUUIDv4()
    this.name = user.name
    this.email = user.email
    this.password_hash = user.password_hash
    this.forgot_password_token = user.forgot_password_token || ''
    this.role = user.role || ['attendee']
    this.avatar_url = user.avatar_url || ''
    this.created_at = new Date()
    this.updated_at = new Date()
  }
}
