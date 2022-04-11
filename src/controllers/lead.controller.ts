import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { LeadService } from '../service/lead.service'
import { errorMessage } from '../utils/prismaerror.utils'
import logger from '../utils/logger'

export class LeadController {
  static async createLeadHandler(req: Request<{ userId: string }, Record<string, unknown>>, res: Response) {
    try {
      const lead = await LeadService.createLead(req.params.userId)
      return res.send(lead)
    } catch (error) {
      const typedError = error as Prisma.PrismaClientKnownRequestError
      logger.error(typedError)
      return res.status(409).send(errorMessage(typedError))
    }
  }
  static async getLeadHandler(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params
      const lead = await LeadService.findLead(id)
      return res.send(lead)
    } catch (error) {
      const typedError = error as Prisma.PrismaClientKnownRequestError
      logger.error(typedError)
      return res.status(404).send(errorMessage(typedError))
    }
  }
  static async getLeadsHandler(
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      Record<string, unknown>,
      { page: string; limit: string }
    >,
    res: Response
  ) {
    const leads = await LeadService.getLeads(req.query)
    return res.send(leads)
  }
  static async deleteLeadHandler(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params
      const deletedLead = await LeadService.deleteLead(id)
      return res.send(deletedLead)
    } catch (error) {
      const typedError = error as Prisma.PrismaClientKnownRequestError
      logger.error(typedError)
      return res.status(404).send(errorMessage(typedError))
    }
  }
}
