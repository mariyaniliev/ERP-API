'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
exports.CelebrationController = void 0;
const celebration_service_1 = require('../service/celebration.service');
const prismaerror_utils_1 = require('../utils/prismaerror.utils');
const logger_1 = __importDefault(require('../utils/logger'));
class CelebrationController {
  static async createCelebrationHandler(req, res) {
    try {
      const { userId } = req.params;
      const query = { ...req.body, user: { connect: { id: userId } } };
      const celebration = await celebration_service_1.CelebrationService.createCelebration(query);
      return res.send(celebration);
    }
    catch (error) {
      const typedError = error;
      logger_1.default.error(typedError);
      return res.status(409).send((0, prismaerror_utils_1.errorMessage)(typedError));
    }
  }
  static async getCelebrationHandler(req, res) {
    try {
      const { id } = req.params;
      const celebration = await celebration_service_1.CelebrationService.findCelebration(id);
      return res.send(celebration);
    }
    catch (error) {
      const typedError = error;
      logger_1.default.error(typedError);
      return res.status(404).send((0, prismaerror_utils_1.errorMessage)(typedError));
    }
  }
  static async getCelebrationsHandler(req, res) {
    const celebrations = await celebration_service_1.CelebrationService.getCelebrations(req.query);
    return res.send(celebrations);
  }
  static async updateCelebrationHandler(req, res) {
    try {
      const { id } = req.params;
      const input = req.body;
      const celebration = await celebration_service_1.CelebrationService.findCelebration(id);
      if (!celebration) {
        return res.sendStatus(404);
      }
      const updatedCelebration = await celebration_service_1.CelebrationService.updateCelebration(celebration.id, input);
      return res.send(updatedCelebration);
    }
    catch (error) {
      const typedError = error;
      logger_1.default.error(typedError);
      return res.status(409).send((0, prismaerror_utils_1.errorMessage)(typedError));
    }
  }
  static async deleteCelebrationHandler(req, res) {
    try {
      const { id } = req.params;
      const deletedCelebration = await celebration_service_1.CelebrationService.deleteCelebration(id);
      return res.send(deletedCelebration);
    }
    catch (error) {
      const typedError = error;
      logger_1.default.error(typedError);
      return res.status(404).send((0, prismaerror_utils_1.errorMessage)(typedError));
    }
  }
}
exports.CelebrationController = CelebrationController;
//# sourceMappingURL=celebration.controller.js.map