"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeUser = void 0;
const lodash_1 = require("lodash");
const session_service_1 = require("../service/session.service");
const prismaerror_utils_1 = require("../utils/prismaerror.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
const logger_1 = __importDefault(require("../utils/logger"));
const deserializeUser = async (req, res, next) => {
    const accessToken = (0, lodash_1.get)(req, 'headers.authorization', '').replace(/^Bearer\s/, '');
    const refreshToken = (0, lodash_1.get)(req, 'headers.x-refresh', '').replace(/^Bearer\s/, '');
    if (!accessToken) {
        return next();
    }
    const { decoded, expired } = (0, jwt_utils_1.verifyJwt)(accessToken);
    if (decoded) {
        res.locals.user = decoded;
        return next();
    }
    if (expired && refreshToken) {
        try {
            const newAccessToken = await (0, session_service_1.reIssueAccessToken)(refreshToken);
            if (!newAccessToken) {
                return res.sendStatus(403);
            }
            res.setHeader('x-access-token', newAccessToken);
            const result = (0, jwt_utils_1.verifyJwt)(newAccessToken);
            res.locals.user = result.decoded;
        }
        catch (error) {
            const typedError = error;
            logger_1.default.error(typedError);
            return res.status(500).send((0, prismaerror_utils_1.errorMessage)(typedError));
        }
        return next();
    }
    return next();
};
exports.deserializeUser = deserializeUser;
//# sourceMappingURL=deserializeUser.js.map