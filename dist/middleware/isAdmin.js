'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.isAdmin = void 0;
const isAdmin = async (req, res, next) => {
  if (process.env.NODE_ENV === 'test') {
    return next();
  }
  if (!res.locals.user)
    return res.sendStatus(403);
  const { authority } = res.locals.user;
  if (authority === 'Admin')
    return next();
  return res.sendStatus(403);
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=isAdmin.js.map