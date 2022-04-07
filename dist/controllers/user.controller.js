"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserHandler = exports.updateUserHandler = exports.searchUsersHandler = exports.getUserHandler = exports.getUsersHandler = exports.createUserHandler = void 0;
const lodash_1 = require("lodash");
const user_service_1 = require("../service/user.service");
const session_service_1 = require("../service/session.service");
const prismaerror_utils_1 = require("../utils/prismaerror.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
const logger_1 = __importDefault(require("../utils/logger"));
async function createUserHandler(req, res) {
    try {
        if (req.body.authority) {
            if (res.locals.user && res.locals.user.authority !== 'Admin') {
                req.body.authority = undefined;
            }
        }
        const user = await (0, user_service_1.createUser)(req.body, req.query.leadId);
        const session = await (0, session_service_1.createSession)(user.id, req.get('user-agent') || '');
        const accessToken = (0, jwt_utils_1.signJwt)({ ...user, session: session.id }, { expiresIn: process.env.JWT_TOKEN_TTL });
        const refreshToken = (0, jwt_utils_1.signJwt)({ ...user, session: session.id }, { expiresIn: process.env.JWT_REFRESH_TOKEN_TTL });
        return res.send({ ...(0, lodash_1.omit)(user, 'password'), accessToken, refreshToken });
    }
    catch (error) {
        const typedError = error;
        logger_1.default.error(typedError);
        return res.status(409).send((0, prismaerror_utils_1.errorMessage)(typedError));
    }
}
exports.createUserHandler = createUserHandler;
async function getUsersHandler(req, res) {
    const users = await (0, user_service_1.getUsers)(req.query);
    return res.send(users);
}
exports.getUsersHandler = getUsersHandler;
async function getUserHandler(req, res) {
    try {
        const user = await (0, user_service_1.findUser)({ id: req.params.id });
        return res.send(user);
    }
    catch (error) {
        const typedError = error;
        logger_1.default.error(typedError);
        return res.status(404).send((0, prismaerror_utils_1.errorMessage)(typedError));
    }
}
exports.getUserHandler = getUserHandler;
async function searchUsersHandler(req, res) {
    try {
        const results = await (0, user_service_1.searchUsers)(req.query);
        return res.send(results);
    }
    catch (error) {
        const typedError = error;
        logger_1.default.error(typedError);
        return res.status(409).send((0, prismaerror_utils_1.errorMessage)(typedError));
    }
}
exports.searchUsersHandler = searchUsersHandler;
async function updateUserHandler(req, res) {
    if (res.locals.user.authority !== 'Admin') {
        req.body.authority = undefined;
    }
    try {
        const user = await (0, user_service_1.updateUser)(req.body, req.params.id, req.query.leadId);
        return res.send((0, lodash_1.omit)(user, 'password'));
    }
    catch (error) {
        const typedError = error;
        logger_1.default.error(typedError);
        return res.status(409).send((0, prismaerror_utils_1.errorMessage)(typedError));
    }
}
exports.updateUserHandler = updateUserHandler;
async function deleteUserHandler(req, res) {
    try {
        const { id } = req.params;
        const deletedUser = await (0, user_service_1.deleteUser)(id);
        return res.send(deletedUser);
    }
    catch (error) {
        const typedError = error;
        logger_1.default.error(typedError);
        return res.status(404).send((0, prismaerror_utils_1.errorMessage)(typedError));
    }
}
exports.deleteUserHandler = deleteUserHandler;
//# sourceMappingURL=user.controller.js.map