import logger from './utils/logger'
import createServer from './utils/server'

const app = createServer()
const port = process.env.API_PORT || 3000

app.listen(port, () => {
  logger.info(`App is running at http://localhost:${port}`)
  logger.info(`Docs avaiable soon at http://localhost:${port}/docs`)
})
