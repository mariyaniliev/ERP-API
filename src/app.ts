import logger from './utils/logger'
import createServer from './utils/server'
import checkUsersForBirthdays from './emails/birthdayEmail'

import cron from 'node-cron'

const app = createServer()
const port = process.env.API_PORT || 3000
const baseUrl = process.env.BASE_URL || 'http://localhost'

app.listen(port, () => {
  logger.info(`App is running at ${baseUrl}:${port}`)
  logger.info(`Swagger docs avaiable at ${baseUrl}:${port}/docs`)
})

// * Checks every day if user has birthday and send email if so
cron.schedule('0 0 10 * * *', () => {
  checkUsersForBirthdays()
})
