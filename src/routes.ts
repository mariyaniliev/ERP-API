import { Express, Request, Response } from 'express'

//Controllers
import { createUserHandler } from './controllers/user.controller'
import { createUserSessionHandler, deleteSessionHandler, getUserSessionHandler } from './controllers/session.controller'
//Schemas
import { createSessionSchema } from './schema/session.schema'
import { createUserSchema } from './schema/user.schema'
//Middlewares
import { validateResource } from './middleware/validateResource'
import { requireUser } from './middleware/requireUser'

export default function routes(app: Express) {
  app.get('/healtcheck', (req: Request, res: Response) => {
    res.sendStatus(200)
  })

  app.post('/api/users', validateResource(createUserSchema), createUserHandler)
  app.post('/api/sessions', validateResource(createSessionSchema), createUserSessionHandler)
  app.get('/api/sessions', requireUser, getUserSessionHandler)
  app.delete('/api/sessions', requireUser, deleteSessionHandler)
}
