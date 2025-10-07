import { envConfig } from './constants/config'
import express from 'express'

const PORT = envConfig.port

const app = express()

app.use(express.json())

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`)
})
