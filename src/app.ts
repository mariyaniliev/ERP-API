import logger from './utils/logger'
import swaggerUi from 'swagger-ui-express'
import createServer from './utils/server'
import SwaggerDoc from './swagger'

const app = createServer()
const port = process.env.API_PORT || 3000
const baseUrl = process.env.BASE_URL || 'http://localhost'
app.use('/docs', swaggerUi.serve, swaggerUi.setup(SwaggerDoc))
app.listen(port, () => {
  logger.info(`App is running at ${baseUrl}:${port}`)
  logger.info(`Swagger docs avaiable at ${baseUrl}:${port}/docs`)
})
