import { Router } from 'express'
import { TimeOffController } from '../controllers/timeoff.controller'
import { isAdminOrOwner } from '../middleware/isAdminOrOwner'

const router = Router()

// * Add new time off
router.post('/timeoffs/:userId', isAdminOrOwner, TimeOffController.createTimeOffHandler)
// * Return all time off's
router.get('/timeoffs', TimeOffController.getTimeOffsHandler)
// * Search time off's
router.get('/timeoffs/search', TimeOffController.searchTimeOffsHandler)
// * Return time off
router.get('/timeoffs/:id', TimeOffController.getTimeOffHandler)
// * Update time off
router.patch('/timeoffs/:id', isAdminOrOwner, TimeOffController.updateTimeOffHandler)
// * Delete time off
router.delete('/timeoffs/:id', isAdminOrOwner, TimeOffController.deleteTimeOffHandler)

export default router
