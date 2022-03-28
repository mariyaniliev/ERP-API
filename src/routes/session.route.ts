import { Router } from 'express'
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionHandler,
} from '../controllers/session.controller'
import { isAdminOrOwner } from '../middleware/isAdminOrOwner'

const router = Router()

// * Login session
router.post('/sessions', createUserSessionHandler)
router.get('/sessions', isAdminOrOwner, getUserSessionHandler)
// * Logout
router.delete('/sessions', isAdminOrOwner, deleteSessionHandler)

export default router
