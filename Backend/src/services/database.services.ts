import { envConfig } from '~/constants/config'

import pg from 'pg'

const { Pool } = pg

class DatabaseService {
  private pool: pg.Pool

  constructor() {
    this.pool = new Pool({
      host: envConfig.dbHost,
      port: Number(envConfig.dbPort),
      database: envConfig.dbDataBase,
      user: envConfig.dbUser,
      password: envConfig.dbPassword
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


}

export const databaseService = new DatabaseService()
