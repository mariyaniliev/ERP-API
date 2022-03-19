import { Express, Request, Response } from 'express'
/**
 * ! Controllers
 */
import { createUserHandler, getUsersHandler } from './controllers/user.controller'
import { createUserSessionHandler, deleteSessionHandler, getUserSessionHandler } from './controllers/session.controller'
/**
 * ! Schemas
 */
import { createSessionSchema } from './schema/session.schema'
import { createUserSchema } from './schema/user.schema'
/**
 * ! Middlewares
 */
import { validateResource } from './middleware/validateResource'
import { requireUser } from './middleware/requireUser'
import { createLeadHandler, getLeadsHandler, updateLeadHandler } from './controllers/lead.controller'

export default function routes(app: Express) {
  /**
   * * CHECKS IF SERVER IS UP
   */
  app.get('/healtcheck', (req: Request, res: Response) => {
    res.sendStatus(200)
  })
  /**
   * * AUTHENTICATION
   */
  // Register
  app.post('/api/users', validateResource(createUserSchema), createUserHandler)
  // Login
  app.post('/api/sessions', validateResource(createSessionSchema), createUserSessionHandler)
  app.get('/api/sessions', requireUser, getUserSessionHandler)
  app.delete('/api/sessions', requireUser, deleteSessionHandler)
  /**
   * * RESOURCES
   */
  // Add new lead
  app.post('/leads', requireUser, createLeadHandler)
  // Return all leads
  app.get('/leads', requireUser, getLeadsHandler)
  // Update lead
  app.patch('/leads/:leadId', requireUser, updateLeadHandler)
  // Return all users
  app.get('/api/users', requireUser, getUsersHandler)
}
