'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
exports.TimeOffController = void 0;
const timeoff_service_1 = require('../service/timeoff.service');
const prismaerror_utils_1 = require('../utils/prismaerror.utils');
const logger_1 = __importDefault(require('../utils/logger'));
class TimeOffController {
  static async createTimeOffHandler(req, res) {
    try {
      const { userId } = req.params;
      const timeOff = await timeoff_service_1.TimeOffService.createTimeOff(req.body, userId);
      return res.send(timeOff);
    }
    catch (error) {
      const typedError = error;
      logger_1.default.error(typedError);
      return res.status(409).send((0, prismaerror_utils_1.errorMessage)(typedError));
    }
  }
  static async getTimeOffHandler(req, res) {
    try {
      const { id } = req.params;
      const timeOff = await timeoff_service_1.TimeOffService.findTimeOff(id);
      return res.send(timeOff);
    }
    catch (error) {
      const typedError = error;
      logger_1.default.error(typedError);
      return res.status(404).send((0, prismaerror_utils_1.errorMessage)(typedError));
    }
  }
  static async getTimeOffsHandler(req, res) {
    const timeOffs = await timeoff_service_1.TimeOffService.getTimeOffs(req.query);
    return res.send(timeOffs);
  }
  static async updateTimeOffHandler(req, res) {
    try {
      const { id } = req.params;
      const input = req.body;
      const timeOff = await timeoff_service_1.TimeOffService.findTimeOff(id);
      if (!timeOff) {
        return res.sendStatus(404);
      }
      const updatedTimeOff = await timeoff_service_1.TimeOffService.updateTimeOff(timeOff.id, input);
      return res.send(updatedTimeOff);
    }
    catch (error) {
      const typedError = error;
      logger_1.default.error(typedError);
      return res.status(409).send((0, prismaerror_utils_1.errorMessage)(typedError));
    }
  }
  static async deleteTimeOffHandler(req, res) {
    try {
      const { id } = req.params;
      const deletedTimeOff = await timeoff_service_1.TimeOffService.deleteTimeOff(id);
      return res.send(deletedTimeOff);
    }
    catch (error) {
      const typedError = error;
      logger_1.default.error(typedError);
      return res.status(404).send((0, prismaerror_utils_1.errorMessage)(typedError));
    }
  }
}
exports.TimeOffController = TimeOffController;
//# sourceMappingURL=timeoff.controller.js.map