import { Router } from 'express'
import {
  createCelebrationHandler,
  deleteCelebrationHandler,
  getCelebrationHandler,
  getCelebrationsHandler,
  updateCelebrationHandler,
} from '../controllers/celebration.controller'
import { isAdminOrOwner } from '../middleware/isAdminOrOwner'

const router = Router()

// * Add new celebration
router.post('/celebrations/:userId', isAdminOrOwner, createCelebrationHandler)
// * Return all celebrations
router.get('/celebrations', getCelebrationsHandler)
// * Return celebration
router.get('/celebrations/:id', getCelebrationHandler)
// * Update celebration
router.patch('/celebrations/:id', isAdminOrOwner, updateCelebrationHandler)
// * Delete celebration
router.delete('/celebrations/:id', isAdminOrOwner, deleteCelebrationHandler)

export default router
