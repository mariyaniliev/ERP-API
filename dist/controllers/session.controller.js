'use strict'
const __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { default: mod }
}
Object.defineProperty(exports, '__esModule', { value: true })
exports.deleteSessionHandler = exports.getUserSessionHandler = exports.createUserSessionHandler = void 0
const session_service_1 = require('../service/session.service')
const user_service_1 = require('../service/user.service')
const prismaerror_utils_1 = require('../utils/prismaerror.utils')
const jwt_utils_1 = require('../utils/jwt.utils')
const logger_1 = __importDefault(require('../utils/logger'))
async function createUserSessionHandler (req, res) {
  try {
    const user = await (0, user_service_1.validatePassword)(req.body)
    if (!user) { return res.status(401).send('Invalid email or password') }
    const session = await (0, session_service_1.createSession)(user.id, req.get('user-agent') || '')
    const accessToken = (0, jwt_utils_1.signJwt)({ ...user, session: session.id }, { expiresIn: process.env.JWT_TOKEN_TTL })
    const refreshToken = (0, jwt_utils_1.signJwt)({ ...user, session: session.id }, { expiresIn: process.env.JWT_REFRESH_TOKEN_TTL })
    return res.send({ accessToken, refreshToken })
  } catch (error) {
    const typedError = error
    logger_1.default.error(typedError)
    return res.status(409).send((0, prismaerror_utils_1.errorMessage)(typedError))
  }
}
exports.createUserSessionHandler = createUserSessionHandler
async function getUserSessionHandler (req, res) {
  try {
    const userId = res.locals.user.id
    const sessions = await (0, session_service_1.findSession)({ userId: userId, valid: true })
    return res.send(sessions)
  } catch (error) {
    const typedError = error
    logger_1.default.error(typedError)
    return res.status(404).send((0, prismaerror_utils_1.errorMessage)(typedError))
  }
}
exports.getUserSessionHandler = getUserSessionHandler
async function deleteSessionHandler (req, res) {
  try {
    const sessionId = res.locals.user.session
    await (0, session_service_1.updateSession)({ id: sessionId }, { valid: false })
    return res.send({ accessToken: null, refreshToken: null })
  } catch (error) {
    const typedError = error
    logger_1.default.error(typedError)
    return res.status(404).send((0, prismaerror_utils_1.errorMessage)(typedError))
  }
}
exports.deleteSessionHandler = deleteSessionHandler
// # sourceMappingURL=session.controller.js.map
