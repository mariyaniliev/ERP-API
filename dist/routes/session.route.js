"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const session_controller_1 = require("../controllers/session.controller");
const router = (0, express_1.Router)();
// * Login session
router.post('/sessions', session_controller_1.createUserSessionHandler);
router.get('/sessions', session_controller_1.getUserSessionHandler);
// * Logout
router.delete('/sessions', session_controller_1.deleteSessionHandler);
exports.default = router;
//# sourceMappingURL=session.route.js.map