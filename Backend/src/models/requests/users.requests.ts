import { UserRole } from "~/types/domain"


export interface RegisterRequestBody {
  name: string
  email: string
  password: string
  confirm_password: string
  role: UserRole[]
}
