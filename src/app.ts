import logger from './utils/logger'
import createServer from './utils/server'

const app = createServer()
const port = process.env.API_PORT || 3000
const baseUrl = process.env.BASE_URL || 'http://localhost'

app.listen(port, () => {
  logger.info(`App is running at ${baseUrl}:${port}`)
  logger.info(`Swagger docs avaiable at ${baseUrl}:${port}/docs`)
})
