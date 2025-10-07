import { config } from 'dotenv'

config()

export const envConfig = {
  supaBaseKey: process.env.SUPABASE_KEY as string,
  supaBaseUrl: process.env.SUPABASE_URL as string,
  dbTodoList: process.env.DB_TODOLIST as string,
  port: process.env.PORT || 4000
} as const
