'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.requireUser = void 0;
const session_service_1 = require('../service/session.service');
const requireUser = async (req, res, next) => {
  if (!res.locals.user)
    return res.sendStatus(403);
  const user = res.locals.user;
  const session = await session_service_1.SessionService.findSession({ userId: user.id, valid: true });
  if (!session)
    return res.sendStatus(403);
  return next();
};
exports.requireUser = requireUser;
//# sourceMappingURL=requireUser.js.map