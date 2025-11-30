import { defaultErrorHandler } from './middlewares/errors.middlewares'
import { envConfig } from './constants/config'
import { initFolder } from './utils/file'

// import '~/utils/fake'
import databaseService from './services/database.services'
import express from 'express'
import usersRouter from './routes/users.routes'
import eventsRouter from './routes/events.routes'
import fs from 'fs'
import YAML from 'yaml'
import swaggerUi from 'swagger-ui-express'
import cors from 'cors'
import mediasRouter from './routes/medias.routes'
import ticketsRouter from './routes/tickets.routes'

const file = fs.readFileSync('MivoraSwagger.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)

const PORT = Number(envConfig.port)

const app = express()
app.use(
  cors({
    origin: ['http://localhost:4000', 'http://localhost:5173', 'http://26.35.82.76:4000', 'http://26.73.34.56:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)
// Create upload folder
initFolder()

app.use(express.json())
app.use('/mivora/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/users', usersRouter)
app.use('/events', eventsRouter)
app.use('/tickets', ticketsRouter)
app.use('/medias', mediasRouter)

databaseService.verifyConnection()

app.use(defaultErrorHandler)

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
