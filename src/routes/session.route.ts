import { Router } from 'express'
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionHandler,
} from '../controllers/session.controller'

const router = Router()

// * Login session
router.post('/sessions', createUserSessionHandler)
router.get('/sessions', getUserSessionHandler)
// * Logout
router.delete('/sessions', deleteSessionHandler)

export default router
