import { config } from 'dotenv'

config()

export const envConfig = {
  port: process.env.PORT,
  
  dbHost: process.env.PGHOST,
  dbPort: process.env.PGPORT as string,
  dbDataBase: process.env.PGDATABASE,
  dbUser: process.env.PGUSER,
  dbPassword: process.env.PGPASSWORD
}