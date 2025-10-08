import express from 'express'
import { databaseService } from './services/database.services'

const PORT = 4000

const app = express()

app.use(express.json())

databaseService.verifyConnection()

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
