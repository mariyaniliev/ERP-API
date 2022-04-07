'use strict'
const __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { default: mod }
}
Object.defineProperty(exports, '__esModule', { value: true })
exports.deleteLeadHandler = exports.getLeadsHandler = exports.getLeadHandler = exports.createLeadHandler = void 0
const lead_service_1 = require('../service/lead.service')
const prismaerror_utils_1 = require('../utils/prismaerror.utils')
const logger_1 = __importDefault(require('../utils/logger'))
async function createLeadHandler (req, res) {
  try {
    const lead = await (0, lead_service_1.createLead)(req.params.userId)
    return res.send(lead)
  } catch (error) {
    const typedError = error
    logger_1.default.error(typedError)
    return res.status(409).send((0, prismaerror_utils_1.errorMessage)(typedError))
  }
}
exports.createLeadHandler = createLeadHandler
async function getLeadHandler (req, res) {
  try {
    const { id } = req.params
    const lead = await (0, lead_service_1.findLead)(id)
    return res.send(lead)
  } catch (error) {
    const typedError = error
    logger_1.default.error(typedError)
    return res.status(404).send((0, prismaerror_utils_1.errorMessage)(typedError))
  }
}
exports.getLeadHandler = getLeadHandler
async function getLeadsHandler (req, res) {
  const leads = await (0, lead_service_1.getLeads)(req.query)
  return res.send(leads)
}
exports.getLeadsHandler = getLeadsHandler
async function deleteLeadHandler (req, res) {
  try {
    const { id } = req.params
    const deletedLead = await (0, lead_service_1.deleteLead)(id)
    return res.send(deletedLead)
  } catch (error) {
    const typedError = error
    logger_1.default.error(typedError)
    return res.status(404).send((0, prismaerror_utils_1.errorMessage)(typedError))
  }
}
exports.deleteLeadHandler = deleteLeadHandler
// # sourceMappingURL=lead.controller.js.map
