import express from 'express'
import dotenv from 'dotenv'
import routes from './routes'
import logger from './utils/logger'
dotenv.config()

const app = express()
const port = process.env.API_PORT || 3000

app.use(express.json())

app.listen(port, () => {
  logger.info(`App is running at http://localhost:${port}`)
  routes(app)
})
