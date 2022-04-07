'use strict'
const __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { default: mod }
}
Object.defineProperty(exports, '__esModule', { value: true })
exports.reIssueAccessToken = exports.updateSession = exports.findSession = exports.createSession = void 0
const client_1 = require('@prisma/client')
const logger_1 = __importDefault(require('../utils/logger'))
const lodash_1 = require('lodash')
const jwt_utils_1 = require('../utils/jwt.utils')
const user_service_1 = require('./user.service')
const client_2 = __importDefault(require('../utils/client'))
async function createSession (userId, userAgent) {
  try {
    const session = await client_2.default.session.create({
      data: { userId, userAgent }
    })
    return session
  } catch (e) {
    if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
      logger_1.default.error(e.code + ' : ' + e.message)
    }
    throw e
  }
}
exports.createSession = createSession
async function findSession (query) {
  const session = await client_2.default.session.findMany({
    where: query
  })
  return session
}
exports.findSession = findSession
async function updateSession (query, input) {
  try {
    const newSession = await client_2.default.session.update({
      where: query,
      data: input
    })
    return newSession
  } catch (e) {
    if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2015') {
        logger_1.default.error('A related record could not be found.')
      }
    }
    throw e
  }
}
exports.updateSession = updateSession
async function reIssueAccessToken (token) {
  const { decoded } = (0, jwt_utils_1.verifyJwt)(token)
  if (!decoded || !(0, lodash_1.get)(decoded, 'session')) {
    return false
  }
  const session = await client_2.default.session.findFirst({
    where: { id: (0, lodash_1.get)(decoded, 'session') }
  })
  if (!session || !session.valid) { return false }
  const user = await (0, user_service_1.findUser)({ id: session.userId })
  if (!user) { return false }
  const accessToken = (0, jwt_utils_1.signJwt)({ ...user, session: session.id }, { expiresIn: process.env.JWT_TOKEN_TTL })
  return accessToken
}
exports.reIssueAccessToken = reIssueAccessToken
// # sourceMappingURL=session.service.js.map
