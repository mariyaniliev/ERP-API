'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
exports.TimeOffService = void 0;
const client_1 = require('@prisma/client');
const logger_1 = __importDefault(require('../utils/logger'));
const client_2 = __importDefault(require('../utils/client'));
class TimeOffService {
  static async createTimeOff(input, userId) {
    try {
      const createdTimeOff = await client_2.default.timeOff.create({
        data: { ...input, user: { connect: { id: userId } } },
      });
      return createdTimeOff;
    }
    catch (e) {
      if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        logger_1.default.error(e.code + ' : ' + e.message);
      }
      throw e;
    }
  }
  static async findTimeOff(id) {
    const timeOff = await client_2.default.timeOff.findFirst({
      where: { id },
      include: { user: { select: { name: true, email: true } } },
    });
    return timeOff;
  }
  static async getTimeOffs(query) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const resultsCount = await client_2.default.timeOff.count();
    const timeOffs = await client_2.default.timeOff.findMany({
      skip: startIndex,
      take: limit,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    return { data: timeOffs, resultsCount };
  }
  static async updateTimeOff(id, input) {
    const updatedTimeOff = await client_2.default.timeOff.update({ where: { id }, data: input });
    return updatedTimeOff;
  }
  static async deleteTimeOff(id) {
    const deletedTimeOff = await client_2.default.timeOff.delete({ where: { id } });
    return deletedTimeOff;
  }
}
exports.TimeOffService = TimeOffService;
//# sourceMappingURL=timeoff.service.js.map