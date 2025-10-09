import { defaultErrorHandler } from './middlewares/errors.middlewares'

import databaseService from './services/database.services'
import express from 'express'
import usersRouter from './routes/users.routes'

const PORT = 4000

const app = express()

app.use(express.json())
app.use('/users', usersRouter)

databaseService.verifyConnection()

app.use(defaultErrorHandler)

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
