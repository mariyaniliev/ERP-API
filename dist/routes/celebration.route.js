'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('express');
const celebration_controller_1 = require('../controllers/celebration.controller');
const isAdminOrOwner_1 = require('../middleware/isAdminOrOwner');
const router = (0, express_1.Router)();
// * Add new celebration
router.post('/celebrations/:userId', isAdminOrOwner_1.isAdminOrOwner, celebration_controller_1.CelebrationController.createCelebrationHandler);
// * Return all celebrations
router.get('/celebrations', celebration_controller_1.CelebrationController.getCelebrationsHandler);
// * Return celebration
router.get('/celebrations/:id', celebration_controller_1.CelebrationController.getCelebrationHandler);
// * Update celebration
router.patch('/celebrations/:id', isAdminOrOwner_1.isAdminOrOwner, celebration_controller_1.CelebrationController.updateCelebrationHandler);
// * Delete celebration
router.delete('/celebrations/:id', isAdminOrOwner_1.isAdminOrOwner, celebration_controller_1.CelebrationController.deleteCelebrationHandler);
exports.default = router;
//# sourceMappingURL=celebration.route.js.map