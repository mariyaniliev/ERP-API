'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('express');
const lead_controller_1 = require('../controllers/lead.controller');
const isAdmin_1 = require('../middleware/isAdmin');
const router = (0, express_1.Router)();
// * Add new lead
router.post('/leads/:userId', isAdmin_1.isAdmin, lead_controller_1.LeadController.createLeadHandler);
// * Return all leads
router.get('/leads', lead_controller_1.LeadController.getLeadsHandler);
// * Return lead
router.get('/leads/:id', lead_controller_1.LeadController.getLeadHandler);
// * Delete lead
router.delete('/leads/:id', isAdmin_1.isAdmin, lead_controller_1.LeadController.deleteLeadHandler);
exports.default = router;
//# sourceMappingURL=lead.route.js.map