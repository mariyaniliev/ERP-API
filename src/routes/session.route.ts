import { Router } from 'express'
import { SessionController } from '../controllers/session.controller'

const router = Router()

// * Login session
router.post('/sessions', SessionController.createUserSessionHandler)
router.get('/sessions', SessionController.getUserSessionHandler)
// * Logout
router.delete('/sessions', SessionController.deleteSessionHandler)

export default router
