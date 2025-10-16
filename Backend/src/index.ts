import { defaultErrorHandler } from './middlewares/errors.middlewares'
import { envConfig } from './constants/config'

import databaseService from './services/database.services'
import express from 'express'
import usersRouter from './routes/users.routes'
import eventsRouter from './routes/events.routes'
import fs from 'fs'
import YAML from 'yaml'
import swaggerUi from 'swagger-ui-express'

const file = fs.readFileSync('MivoraSwagger.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)

const PORT = envConfig.port

const app = express()

app.use(express.json())
app.use('/mivora/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/users', usersRouter)
app.use('/events', eventsRouter)

databaseService.verifyConnection()

app.use(defaultErrorHandler)

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
