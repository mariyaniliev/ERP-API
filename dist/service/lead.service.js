'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
exports.LeadService = void 0;
const client_1 = require('@prisma/client');
const logger_1 = __importDefault(require('../utils/logger'));
const client_2 = __importDefault(require('../utils/client'));
class LeadService {
  static async createLead(userId) {
    try {
      const createdLead = await client_2.default.lead.create({
        data: { leadInfo: { connect: { id: userId } } },
      });
      return createdLead;
    }
    catch (e) {
      if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        logger_1.default.error(e.code + ' : ' + e.message);
      }
      throw e;
    }
  }
  static async findLead(id) {
    const lead = await client_2.default.lead.findFirst({
      where: { id },
      include: {
        leadInfo: {
          select: {
            email: true,
            name: true,
            enabled: true,
            authority: true,
            phone: true,
            discord: true,
            createdAt: true,
            updatedAt: true,
            leadId: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
            email: true,
            discord: true,
          },
        },
      },
    });
    return lead;
  }
  static async getLeads(query) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const resultsCount = await client_2.default.lead.count();
    const leads = await client_2.default.lead.findMany({
      skip: startIndex,
      take: limit,
      include: {
        leadInfo: { select: { name: true, email: true, discord: true } },
        team: { select: { name: true, email: true, discord: true } },
      },
    });
    return { data: leads, resultsCount };
  }
  static async deleteLead(id) {
    const deleted = await client_2.default.lead.delete({ where: { id } });
    return deleted;
  }
}
exports.LeadService = LeadService;
//# sourceMappingURL=lead.service.js.map