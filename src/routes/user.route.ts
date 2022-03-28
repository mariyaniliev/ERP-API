import { Router } from 'express'
import {
  createUserHandler,
  deleteUserHandler,
  getUserHandler,
  getUsersHandler,
  searchUsersHandler,
  updateUserHandler,
} from '../controllers/user.controller'
import { isAdminOrOwner } from '../middleware/isAdminOrOwner'
import { requireUser } from '../middleware/requireUser'

const router = Router()

// * Register (accepts query "leadId")
router.post('/users', createUserHandler)
/*
   ? Search queries avaiable:
   * email, 
   * name, 
   * phone, 
   * discord, page, 
   * limit, 
   * enabled, 
   * leadId, 
   * authority, 
   * tshirtSize,
   * alcohol
   */

router.get('/users/search', requireUser, searchUsersHandler)
// * Return all users
router.get('/users', requireUser, getUsersHandler)
// * Return user
router.get('/users/:id', requireUser, getUserHandler)
// * Update user // Accepts query "leadId"
router.patch('/users/:id', isAdminOrOwner, updateUserHandler)
// * Delete user
router.delete('/users/:id', isAdminOrOwner, deleteUserHandler)

export default router
