import { config } from 'dotenv'

config()

export const envConfig = {
  port: process.env.PORT,

  dbHost: process.env.PGHOST,
  dbPort: process.env.PGPORT as string,
  dbDataBase: process.env.PGDATABASE,
  dbUser: process.env.PGUSER,
  dbPassword: process.env.PGPASSWORD,

  jwtSecretAccessToken: process.env.JWT_SECRET_ACCESS_TOKEN,
  jwtSecretRefreshToken: process.env.JWT_SECRET_REFRESH_TOKEN,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,

  passwordSecret: process.env.PASSWORD_SECRET
}
