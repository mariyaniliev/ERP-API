"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdminOrOwner = void 0;
const isAdminOrOwner = async (req, res, next) => {
    if (!res.locals.user)
        return res.sendStatus(403);
    const { id, authority } = res.locals.user;
    if (process.env.NODE_ENV === 'test' || authority === 'Admin') {
        return next();
    }
    const candidateId = req.params.id;
    if (req.params.userId) {
        if (id !== req.params.userId || authority !== 'Admin') {
            return res.sendStatus(403);
        }
    }
    if (id !== candidateId)
        return res.sendStatus(403);
    return next();
};
exports.isAdminOrOwner = isAdminOrOwner;
//# sourceMappingURL=isAdminOrOwner.js.map