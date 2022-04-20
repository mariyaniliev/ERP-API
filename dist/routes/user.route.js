'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('express');
const user_controller_1 = require('../controllers/user.controller');
const isAdmin_1 = require('../middleware/isAdmin');
const isAdminOrOwner_1 = require('../middleware/isAdminOrOwner');
const requireUser_1 = require('../middleware/requireUser');
const timeOffModifyGuard_1 = require('../middleware/timeOffModifyGuard');
const router = (0, express_1.Router)();
// * Register (accepts query "leadId")
router.post('/users', isAdmin_1.isAdmin, timeOffModifyGuard_1.timeOffModifyGuard, user_controller_1.UserController.createUserHandler);
/*
   ? Search queries avaiable:
   * emailOrName,
   * page,
   * limit,
   * leadId,
   * birthday
   */
router.get('/users/search', requireUser_1.requireUser, user_controller_1.UserController.searchUsersHandler);
// * Return all users
router.get('/users', requireUser_1.requireUser, user_controller_1.UserController.getUsersHandler);
// * Return user
router.get('/users/:id', requireUser_1.requireUser, user_controller_1.UserController.getUserHandler);
// * Update user // Accepts query "leadId"
router.patch('/users/:id', isAdminOrOwner_1.isAdminOrOwner, timeOffModifyGuard_1.timeOffModifyGuard, user_controller_1.UserController.updateUserHandler);
// * Delete user
router.delete('/users/:id', isAdminOrOwner_1.isAdminOrOwner, user_controller_1.UserController.deleteUserHandler);
exports.default = router;
//# sourceMappingURL=user.route.js.map