import { JwtPayload } from '@supabase/supabase-js'
import { TokenType } from '~/constants/enums'
import { UUIDv4 } from '~/types/common'
import { UserRole } from '~/types/domain'

// Body
export interface RegisterRequestBody {
  name: string
  email: string
  password: string
  confirm_password: string
  role?: string
  avatar_url?: string
}

export interface LoginRequestBody {
  email: string
  password: string
}

export interface LogoutRequestBody {
  refresh_token: string
}

export interface RefreshTokenRequestBody {
  refresh_token: string
}

export interface TokenPayload extends JwtPayload {
  user_id: UUIDv4
  token_type: TokenType
  iat: number
  exp: number
}

export interface UpdateMeRequestBody {
  name?: string
  avatar_url?: string
  role?: UserRole
}