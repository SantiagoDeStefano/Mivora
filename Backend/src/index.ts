import { defaultErrorHandler } from './middlewares/errors.middlewares'
import { envConfig } from './constants/config'

import databaseService from './services/database.services'
import express from 'express'
import usersRouter from './routes/users.routes'
import eventsRouter from './routes/events.routes'
import fs from 'fs'
import YAML from 'yaml'
import swaggerUi from 'swagger-ui-express'
import cors from 'cors'

const file = fs.readFileSync('MivoraSwagger.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)

const PORT = envConfig

const app = express()
// ✅ Must be at the very top, before routes
app.use(
  cors({
    origin: ['http://localhost:4000', 'http://26.35.82.76:4000'],
    credentials: true
  })
)

app.use(express.json())
app.use('/mivora/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/users', usersRouter)
app.use('/events', eventsRouter)

databaseService.verifyConnection()

app.use(defaultErrorHandler)

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
