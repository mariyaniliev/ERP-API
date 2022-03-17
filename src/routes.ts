import { Express, Request, Response } from 'express'

/* //Controllers
import { createUserHandler } from './controller/user.controller'
import {
  createUserSessionHandler,
  getUserSessionHandler,
} from './controller/session.controller'
//Schemas
import { createSessionSchema } from './schema/session.schema'
import { createUserSchema } from './schema/user.schema'
//Middlewares
import { validateResource } from './middleware/validateResource'
import { requireUser } from './middleware/requireUser' */

function routes(app: Express) {
  app.get('/healtcheck', (req: Request, res: Response) => {
    res.sendStatus(200)
  })

/*   app.post('/api/users', validateResource(createUserSchema), createUserHandler)
  app.post(
    '/api/sessions',
    validateResource(createSessionSchema),
    createUserSessionHandler,
  )
  app.get('/api/sessions', requireUser, getUserSessionHandler) */
}

export default routes