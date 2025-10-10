import { UUIDv4 } from '~/types/common'
import { newUUIDv4 } from '~/utils/uuid'
import pg from 'pg'

export interface RefreshTokenType extends pg.QueryResultRow {
  id?: UUIDv4
  user_id: UUIDv4
  token_hash: string
  created_at?: Date
  iat: number
  exp: number
  revoked?: boolean
}

export default class RefreshToken {
  id: UUIDv4
  user_id: UUIDv4
  token_hash: string
  created_at?: Date
  iat: number
  exp: number
  revoked: boolean

  constructor(refreshToken: RefreshTokenType) {
    this.id = refreshToken.id || newUUIDv4()
    this.user_id = refreshToken.user_id
    this.token_hash = refreshToken.token_hash
    this.created_at = new Date()
    this.iat = refreshToken.iat
    this.exp = refreshToken.exp
    this.revoked = refreshToken.revoked || false
  }
}