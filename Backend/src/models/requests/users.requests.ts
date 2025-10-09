import { JwtPayload } from "@supabase/supabase-js"
import { TokenType } from "~/constants/enums"
import { UserRole } from "~/types/domain"


export interface RegisterRequestBody {
  name: string
  email: string
  password: string
  confirm_password: string
  role: UserRole
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  iat: number
  exp: number
}