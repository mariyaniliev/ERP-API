"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCelebrationHandler = exports.updateCelebrationHandler = exports.getCelebrationsHandler = exports.getCelebrationHandler = exports.createCelebrationHandler = void 0;
const celebration_service_1 = require("../service/celebration.service");
const logger_1 = __importDefault(require("../utils/logger"));
const prismaerror_utils_1 = require("../utils/prismaerror.utils");
async function createCelebrationHandler(req, res) {
    try {
        const { userId } = req.params;
        const query = { ...req.body, user: { connect: { id: userId } } };
        const celebration = await (0, celebration_service_1.createCelebration)(query);
        return res.send(celebration);
    }
    catch (error) {
        const typedError = error;
        logger_1.default.error(typedError);
        return res.status(409).send((0, prismaerror_utils_1.errorMessage)(typedError));
    }
}
exports.createCelebrationHandler = createCelebrationHandler;
async function getCelebrationHandler(req, res) {
    try {
        const { id } = req.params;
        const celebration = await (0, celebration_service_1.findCelebration)(id);
        return res.send(celebration);
    }
    catch (error) {
        const typedError = error;
        logger_1.default.error(typedError);
        return res.status(404).send((0, prismaerror_utils_1.errorMessage)(typedError));
    }
}
exports.getCelebrationHandler = getCelebrationHandler;
async function getCelebrationsHandler(req, res) {
    const celebrations = await (0, celebration_service_1.getCelebrations)(req.query);
    return res.send(celebrations);
}
exports.getCelebrationsHandler = getCelebrationsHandler;
async function updateCelebrationHandler(req, res) {
    try {
        const { id } = req.params;
        const input = req.body;
        const celebration = await (0, celebration_service_1.findCelebration)(id);
        if (!celebration) {
            return res.sendStatus(404);
        }
        const updatedCelebration = await (0, celebration_service_1.updateCelebration)(celebration.id, input);
        return res.send(updatedCelebration);
    }
    catch (error) {
        const typedError = error;
        logger_1.default.error(typedError);
        return res.status(409).send((0, prismaerror_utils_1.errorMessage)(typedError));
    }
}
exports.updateCelebrationHandler = updateCelebrationHandler;
async function deleteCelebrationHandler(req, res) {
    try {
        const { id } = req.params;
        const deletedCelebration = await (0, celebration_service_1.deleteCelebration)(id);
        return res.send(deletedCelebration);
    }
    catch (error) {
        const typedError = error;
        logger_1.default.error(typedError);
        return res.status(404).send((0, prismaerror_utils_1.errorMessage)(typedError));
    }
}
exports.deleteCelebrationHandler = deleteCelebrationHandler;
//# sourceMappingURL=celebration.controller.js.map