import { envConfig } from '~/constants/config'
import pg from 'pg'

const { Pool } = pg

console.log(envConfig)

class DatabaseService {
  private pool: pg.Pool

  constructor() {
    this.pool = new Pool({
      host: envConfig.dbHost,
      port: Number(envConfig.dbPort),
      database: envConfig.dbDataBase,
      user: envConfig.dbUser,
      password: envConfig.dbPassword,
    })
  }
  async verifyConnection() {
    try {
      const res = await this.pool.query('SELECT NOW()')
      console.log('PostgreSQL connection verified at:', res.rows[0].now)
    } catch (error) {
      console.error('Failed to connect to PostgreSQL:', error)
      throw error
    }
  }
  users = (sqlQuery: string, params?: string[]) => this.pool.query(sqlQuery, params)
  user_roles = (sqlQuery: string, params?: string[]) => this.pool.query(sqlQuery, params)
  refresh_tokens = (sqlQuery: string, params?: any[]) => this.pool.query(sqlQuery, params)
  events = (sqlQuery: string, params?: any[]) => this.pool.query(sqlQuery, params)
}

const databaseService = new DatabaseService()
export default databaseService
