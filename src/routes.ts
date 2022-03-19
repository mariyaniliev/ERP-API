import { Express, Request, Response } from 'express'
/**
 * ! Controllers
 */
import { createUserHandler, getUsersHandler } from './controllers/user.controller'
import { createUserSessionHandler, deleteSessionHandler, getUserSessionHandler } from './controllers/session.controller'
import {
  createLeadHandler,
  deleteLeadHandler,
  getLeadHandler,
  getLeadsHandler,
  updateLeadHandler,
} from './controllers/lead.controller'
import {
  createTimeOffHandler,
  deleteTimeOffHandler,
  getTimeOffHandler,
  getTimeOffsHandler,
  updateTimeOffHandler,
} from './controllers/timeoff.controller'
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
import {
  createCelebrationHandler,
  deleteCelebrationHandler,
  getCelebrationHandler,
  getCelebrationsHandler,
  updateCelebrationHandler,
} from './controllers/celebration.controller'

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
  app.post('/users', validateResource(createUserSchema), createUserHandler)
  // Login session
  app.post('/sessions', validateResource(createSessionSchema), createUserSessionHandler)
  app.get('/sessions', requireUser, getUserSessionHandler)
  app.delete('/sessions', requireUser, deleteSessionHandler)
  /**
   * * RESOURCES
   */
  // Return all users
  app.get('/users', requireUser, getUsersHandler)
  
  // Add new lead
  app.post('/leads', requireUser, createLeadHandler)
  // Return all leads
  app.get('/leads', requireUser, getLeadsHandler)
  // Return lead
  app.get('/leads/:leadId', requireUser, getLeadHandler)
  // Update lead
  app.patch('/leads/:leadId', requireUser, updateLeadHandler)
  // Delete lead
  app.delete('/leads/:leadId', requireUser, deleteLeadHandler)

  // Add new time off
  app.post('/timeoffs', requireUser, createTimeOffHandler)
  // Return all time off's
  app.get('/timeoffs', requireUser, getTimeOffsHandler)
  // Return time off
  app.get('/timeoffs/:id', requireUser, getTimeOffHandler)
  // Update time off
  app.patch('/timeoffs/:id', requireUser, updateTimeOffHandler)
  // Delete time off
  app.delete('/timeoffs/:id', requireUser, deleteTimeOffHandler)

  // Add new celebration
  app.post('/celebrations/:userId', requireUser, createCelebrationHandler)
  // Return all celebrations
  app.get('/celebrations', requireUser, getCelebrationsHandler)
  // Return celebration
  app.get('/celebrations/:id', requireUser, getCelebrationHandler)
  // Update celebration
  app.patch('/celebrations/:id', requireUser, updateCelebrationHandler)
  // Delete celebration
  app.delete('/celebrations/:id', requireUser, deleteCelebrationHandler)
}
