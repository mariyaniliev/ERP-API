import { Router } from 'express'
import {
  createTimeOffHandler,
  deleteTimeOffHandler,
  getTimeOffHandler,
  getTimeOffsHandler,
  updateTimeOffHandler,
} from '../controllers/timeoff.controller'
import { isAdminOrOwner } from '../middleware/isAdminOrOwner'

const router = Router()

// * Add new time off
router.post('/timeoffs/:userId', isAdminOrOwner, createTimeOffHandler)
// * Return all time off's
router.get('/timeoffs', getTimeOffsHandler)
// * Return time off
router.get('/timeoffs/:id', getTimeOffHandler)
// * Update time off
router.patch('/timeoffs/:id', isAdminOrOwner, updateTimeOffHandler)
// * Delete time off
router.delete('/timeoffs/:id', isAdminOrOwner, deleteTimeOffHandler)

export default router
