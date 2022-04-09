'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
exports.CelebrationService = void 0;
const client_1 = require('@prisma/client');
const logger_1 = __importDefault(require('../utils/logger'));
const client_2 = __importDefault(require('../utils/client'));
class CelebrationService {
  static async createCelebration(query) {
    try {
      const createdCelebration = await client_2.default.celebration.create({ data: query });
      return createdCelebration;
    }
    catch (e) {
      if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        logger_1.default.error(e.code + ' : ' + e.message);
      }
      throw e;
    }
  }
  static async findCelebration(id) {
    const celebration = await client_2.default.celebration.findFirst({
      where: { id },
      include: { user: { select: { name: true, email: true } } },
    });
    return celebration;
  }
  static async getCelebrations(query) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const resultsCount = await client_2.default.celebration.count();
    const celebrations = await client_2.default.celebration.findMany({
      skip: startIndex,
      take: limit,
      include: {
        user: {
          select: {
            name: true,
            birthday: true,
          },
        },
      },
    });
    return { data: celebrations, resultsCount };
  }
  static async updateCelebration(id, input) {
    const updatedCelebration = await client_2.default.celebration.update({ where: { id }, data: input });
    return updatedCelebration;
  }
  static async deleteCelebration(id) {
    const deletedCelebration = await client_2.default.celebration.delete({ where: { id } });
    return deletedCelebration;
  }
}
exports.CelebrationService = CelebrationService;
//# sourceMappingURL=celebration.service.js.map