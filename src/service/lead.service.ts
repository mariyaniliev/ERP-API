import { Prisma } from '@prisma/client'
import logger from '../utils/logger'
import prisma from '../utils/client'

export class LeadService {
  static async createLead(userId: string) {
    try {
      const createdLead = await prisma.lead.create({
        data: { leadInfo: { connect: { id: userId } } },
      })
      return createdLead
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        logger.error(e.code + ' : ' + e.message)
      }
      throw e
    }
  }

  static async findLead(id: string) {
    const lead = await prisma.lead.findFirst({
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
    })
    return lead
  }
  static async getLeads(query: { page: string; limit: string }) {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const startIndex = (page - 1) * limit
    const resultsCount = await prisma.lead.count()
    const leads = await prisma.lead.findMany({
      skip: startIndex,
      take: limit,
      include: {
        leadInfo: { select: { name: true, email: true, discord: true } },
        team: { select: { name: true, email: true, discord: true } },
      },
    })
    return { data: leads, resultsCount }
  }
  static async deleteLead(id: string) {
    const deleted = await prisma.lead.delete({ where: { id } })
    return deleted
  }
}
