'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.timeOffModifyGuard = void 0;
const timeOffModifyGuard = async (req, res, next) => {
  if (req.body.timeOffRemainingDays) {
    return res.status(409).send('You cant modify time off days');
  }
  return next();
};
exports.timeOffModifyGuard = timeOffModifyGuard;
//# sourceMappingURL=timeOffModifyGuard.js.map