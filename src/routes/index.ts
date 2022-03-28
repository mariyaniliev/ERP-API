import { Express, Request, Response } from 'express'
import swaggerUi from 'swagger-ui-express'
import SwaggerDoc from '../swagger'
/**
 * ! Controllers
 */
import CelebrationsController from './celebration.route'
import LeadsController from './lead.route'
import TimeOffsController from './timeOff.route'
import UsersController from './user.route'
import SessionsController from './session.route'
/**
 * ! Middlewares
 */
import { requireUser } from '../middleware/requireUser'

export default function routes(app: Express) {
  // * CHECKS IF SERVER IS UP
  app.get('/healthcheck', (req: Request, res: Response) => {
    res.sendStatus(200)
  })
  // * SWAGGER DOCUMENTATION
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(SwaggerDoc))

  // ! AUTHENTICATION
  app.use(UsersController)
  app.use(SessionsController)
  // ! RESOURCES
  app.use(requireUser, TimeOffsController)
  app.use(requireUser, LeadsController)
  app.use(requireUser, CelebrationsController)
}
