'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const express_1 = require('express')
const timeoff_controller_1 = require('../controllers/timeoff.controller')
const isAdminOrOwner_1 = require('../middleware/isAdminOrOwner')
const router = (0, express_1.Router)()
// * Add new time off
router.post('/timeoffs/:userId', isAdminOrOwner_1.isAdminOrOwner, timeoff_controller_1.createTimeOffHandler)
// * Return all time off's
router.get('/timeoffs', timeoff_controller_1.getTimeOffsHandler)
// * Return time off
router.get('/timeoffs/:id', timeoff_controller_1.getTimeOffHandler)
// * Update time off
router.patch('/timeoffs/:id', isAdminOrOwner_1.isAdminOrOwner, timeoff_controller_1.updateTimeOffHandler)
// * Delete time off
router.delete('/timeoffs/:id', isAdminOrOwner_1.isAdminOrOwner, timeoff_controller_1.deleteTimeOffHandler)
exports.default = router
// # sourceMappingURL=timeoff.route.js.map
