'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
exports.SessionService = void 0;
const client_1 = require('@prisma/client');
const lodash_1 = require('lodash');
const jwt_utils_1 = require('../utils/jwt.utils');
const user_service_1 = require('./user.service');
const logger_1 = __importDefault(require('../utils/logger'));
const client_2 = __importDefault(require('../utils/client'));
class SessionService {
  static async createSession(userId, userAgent) {
    try {
      const session = await client_2.default.session.create({
        data: { userId, userAgent },
      });
      return session;
    }
    catch (e) {
      if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        logger_1.default.error(e.code + ' : ' + e.message);
      }
      throw e;
    }
  }
  static async findSession(query) {
    const session = await client_2.default.session.findMany({
      where: query,
    });
    return session;
  }
  static async updateSession(query, input) {
    try {
      const newSession = await client_2.default.session.update({
        where: query,
        data: input,
      });
      return newSession;
    }
    catch (e) {
      if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2015') {
          logger_1.default.error('A related record could not be found.');
        }
      }
      throw e;
    }
  }
  static async reIssueAccessToken(token) {
    const { decoded } = (0, jwt_utils_1.verifyJwt)(token);
    if (!decoded || !(0, lodash_1.get)(decoded, 'session')) {
      return false;
    }
    const session = await client_2.default.session.findFirst({
      where: { id: (0, lodash_1.get)(decoded, 'session') },
    });
    if (!session || !session.valid)
      return false;
    const user = await user_service_1.UserService.findUser({ id: session.userId });
    if (!user)
      return false;
    const accessToken = (0, jwt_utils_1.signJwt)({ ...user, session: session.id }, { expiresIn: process.env.JWT_TOKEN_TTL });
    return accessToken;
  }
}
exports.SessionService = SessionService;
//# sourceMappingURL=session.service.js.map