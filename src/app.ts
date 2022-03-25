import logger from './utils/logger'
import swaggerUi from 'swagger-ui-express'
import createServer from './utils/server'
import SwaggerDoc from './swagger'

const app = createServer()
const port = process.env.API_PORT || 3000

app.use('/docs', swaggerUi.serve, swaggerUi.setup(SwaggerDoc))
app.listen(port, () => {
  logger.info(`App is running at http://localhost:${port}`)
  logger.info(`Docs avaiable at http://localhost:${port}/docs`)
})
