import { RegisterRequestBody } from '~/models/requests/users.requests'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'

class UserService {
  async register(payload: RegisterRequestBody) {
    const { name, email, password, role } = payload
    const password_hash = password + '1' 
    const new_user = new User({
      name, email, password_hash, role
    })
    console.log(new_user)
    const result = await databaseService.users(
      `INSERT INTO users(name, email, password_hash, role) VALUES($1, $2, $3, $4::user_role[])`,
      [new_user.name, new_user.email, new_user.password_hash, `{${new_user.role.toString()}}`]
    )
    return {
      result
    }
  }
  async checkEmailExist(email: string) {
    const user = await databaseService.users(`SELECT * FROM users WHERE users.email=$1`, [email])
    return user != null
  }
}

const userService = new UserService()
export default userService
