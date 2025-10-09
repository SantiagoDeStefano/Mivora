import { RegisterRequestBody } from '~/models/requests/users.requests'
import User, { UserType } from '~/models/schemas/User.schema'
import { User_Roles } from '~/models/schemas/User_roles.schema'
import databaseService from '~/services/database.services'

class UserService {
  async register(payload: RegisterRequestBody) {
    const { name, email, password, role } = payload
    const password_hash = password + '1'
    const new_user = new User({
      name,
      email,
      password_hash,
    })
    const result = Promise.all([
      await databaseService.users<UserType>(`INSERT INTO users(id, name, email, password_hash) VALUES($1, $2, $3, $4)`, [
        new_user.id,
        new_user.name,
        new_user.email,
        new_user.password_hash
      ]),
      await databaseService.user_roles<User_Roles>(
        `INSERT INTO user_roles (user_id, role) VALUES ($1, $2)`,
        [new_user.id, role || 'attendee']
      )
    ])
    return {
      result
    }
  }
  async checkEmailExist(email: string) {
    const result = await databaseService.users<UserType>(`SELECT id FROM users WHERE users.email=$1`, [email])
    return result.rows.length > 0
  }
}

const userService = new UserService()
export default userService
