import express from 'express'
import { deserializeUser } from './middleware/deserializeUser'
import dotenv from 'dotenv'
import routes from './routes'
import logger from './utils/logger'

dotenv.config()
const app = express()
const port = process.env.API_PORT || 3000

app.use(express.json())

/**
 * * Check if the user provides valid token
 * ? If not
 * ! routes are blocked
 * * by the next middleware which expects user in res.locals
 * ? If valid
 * * user is assigned to res.locals
 */
app.use(deserializeUser)

app.listen(port, () => {
  logger.info(`App is running at http://localhost:${port}`)
  logger.info(`Docs avaiable soon at http://localhost:${port}/docs`)
  routes(app)
})
