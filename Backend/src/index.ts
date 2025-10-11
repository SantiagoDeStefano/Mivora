import { defaultErrorHandler } from './middlewares/errors.middlewares'
import { envConfig } from './constants/config'

import databaseService from './services/database.services'
import express from 'express'
import usersRouter from './routes/users.routes'

const PORT = envConfig

const app = express()

app.use(express.json())
app.use('/users', usersRouter)

databaseService.verifyConnection()

app.use(defaultErrorHandler)

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
