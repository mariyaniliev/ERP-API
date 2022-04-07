"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTimeOffHandler = exports.updateTimeOffHandler = exports.getTimeOffsHandler = exports.getTimeOffHandler = exports.createTimeOffHandler = void 0;
const timeoff_service_1 = require("../service/timeoff.service");
const prismaerror_utils_1 = require("../utils/prismaerror.utils");
const logger_1 = __importDefault(require("../utils/logger"));
async function createTimeOffHandler(req, res) {
    try {
        const { userId } = req.params;
        const timeOff = await (0, timeoff_service_1.createTimeOff)(req.body, userId);
        return res.send(timeOff);
    }
    catch (error) {
        const typedError = error;
        logger_1.default.error(typedError);
        return res.status(409).send((0, prismaerror_utils_1.errorMessage)(typedError));
    }
}
exports.createTimeOffHandler = createTimeOffHandler;
async function getTimeOffHandler(req, res) {
    try {
        const { id } = req.params;
        const timeOff = await (0, timeoff_service_1.findTimeOff)(id);
        return res.send(timeOff);
    }
    catch (error) {
        const typedError = error;
        logger_1.default.error(typedError);
        return res.status(404).send((0, prismaerror_utils_1.errorMessage)(typedError));
    }
}
exports.getTimeOffHandler = getTimeOffHandler;
async function getTimeOffsHandler(req, res) {
    const timeOffs = await (0, timeoff_service_1.getTimeOffs)(req.query);
    return res.send(timeOffs);
}
exports.getTimeOffsHandler = getTimeOffsHandler;
async function updateTimeOffHandler(req, res) {
    try {
        const { id } = req.params;
        const input = req.body;
        const timeOff = await (0, timeoff_service_1.findTimeOff)(id);
        if (!timeOff) {
            return res.sendStatus(404);
        }
        const updatedTimeOff = await (0, timeoff_service_1.updateTimeOff)(timeOff.id, input);
        return res.send(updatedTimeOff);
    }
    catch (error) {
        const typedError = error;
        logger_1.default.error(typedError);
        return res.status(409).send((0, prismaerror_utils_1.errorMessage)(typedError));
    }
}
exports.updateTimeOffHandler = updateTimeOffHandler;
async function deleteTimeOffHandler(req, res) {
    try {
        const { id } = req.params;
        const deletedTimeOff = await (0, timeoff_service_1.deleteTimeOff)(id);
        return res.send(deletedTimeOff);
    }
    catch (error) {
        const typedError = error;
        logger_1.default.error(typedError);
        return res.status(404).send((0, prismaerror_utils_1.errorMessage)(typedError));
    }
}
exports.deleteTimeOffHandler = deleteTimeOffHandler;
//# sourceMappingURL=timeoff.controller.js.map