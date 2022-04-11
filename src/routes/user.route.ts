import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { isAdmin } from '../middleware/isAdmin'
import { isAdminOrOwner } from '../middleware/isAdminOrOwner'
import { requireUser } from '../middleware/requireUser'

const router = Router()

// * Register (accepts query "leadId")
router.post('/users', isAdmin, UserController.createUserHandler)
/*
   ? Search queries avaiable:
   * emailOrName, 
   * page, 
   * limit, 
   * leadId, 
   * birthday
   */
router.get('/users/search', requireUser, UserController.searchUsersHandler)
// * Return all users
router.get('/users', requireUser, UserController.getUsersHandler)
// * Return user
router.get('/users/:id', requireUser, UserController.getUserHandler)
// * Update user // Accepts query "leadId"
router.patch('/users/:id', isAdminOrOwner, UserController.updateUserHandler)
// * Delete user
router.delete('/users/:id', isAdminOrOwner, UserController.deleteUserHandler)

export default router
