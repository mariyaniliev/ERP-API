"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const isAdminOrOwner_1 = require("../middleware/isAdminOrOwner");
const requireUser_1 = require("../middleware/requireUser");
const router = (0, express_1.Router)();
// * Register (accepts query "leadId")
router.post('/users', user_controller_1.createUserHandler);
/*
   ? Search queries avaiable:
   * emailOrName,
   * page,
   * limit,
   * leadId,
   * birthday
   */
router.get('/users/search', requireUser_1.requireUser, user_controller_1.searchUsersHandler);
// * Return all users
router.get('/users', requireUser_1.requireUser, user_controller_1.getUsersHandler);
// * Return user
router.get('/users/:id', requireUser_1.requireUser, user_controller_1.getUserHandler);
// * Update user // Accepts query "leadId"
router.patch('/users/:id', isAdminOrOwner_1.isAdminOrOwner, user_controller_1.updateUserHandler);
// * Delete user
router.delete('/users/:id', isAdminOrOwner_1.isAdminOrOwner, user_controller_1.deleteUserHandler);
exports.default = router;
//# sourceMappingURL=user.route.js.map