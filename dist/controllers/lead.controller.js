'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
exports.LeadController = void 0;
const lead_service_1 = require('../service/lead.service');
const prismaerror_utils_1 = require('../utils/prismaerror.utils');
const logger_1 = __importDefault(require('../utils/logger'));
class LeadController {
  static async createLeadHandler(req, res) {
    try {
      const lead = await lead_service_1.LeadService.createLead(req.params.userId);
      return res.send(lead);
    }
    catch (error) {
      const typedError = error;
      logger_1.default.error(typedError);
      return res.status(409).send((0, prismaerror_utils_1.errorMessage)(typedError));
    }
  }
  static async getLeadHandler(req, res) {
    try {
      const { id } = req.params;
      const lead = await lead_service_1.LeadService.findLead(id);
      return res.send(lead);
    }
    catch (error) {
      const typedError = error;
      logger_1.default.error(typedError);
      return res.status(404).send((0, prismaerror_utils_1.errorMessage)(typedError));
    }
  }
  static async getLeadsHandler(req, res) {
    const leads = await lead_service_1.LeadService.getLeads(req.query);
    return res.send(leads);
  }
  static async deleteLeadHandler(req, res) {
    try {
      const { id } = req.params;
      const deletedLead = await lead_service_1.LeadService.deleteLead(id);
      return res.send(deletedLead);
    }
    catch (error) {
      const typedError = error;
      logger_1.default.error(typedError);
      return res.status(404).send((0, prismaerror_utils_1.errorMessage)(typedError));
    }
  }
}
exports.LeadController = LeadController;
//# sourceMappingURL=lead.controller.js.map