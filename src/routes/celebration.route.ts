import { Router } from 'express'
import { CelebrationController } from '../controllers/celebration.controller'
import { isAdminOrOwner } from '../middleware/isAdminOrOwner'

const router = Router()

// * Add new celebration
router.post('/celebrations/:userId', isAdminOrOwner, CelebrationController.createCelebrationHandler)
// * Return all celebrations
router.get('/celebrations', CelebrationController.getCelebrationsHandler)
// * Return celebration
router.get('/celebrations/:id', CelebrationController.getCelebrationHandler)
// * Update celebration
router.patch('/celebrations/:id', isAdminOrOwner, CelebrationController.updateCelebrationHandler)
// * Delete celebration
router.delete('/celebrations/:id', isAdminOrOwner, CelebrationController.deleteCelebrationHandler)

export default router
