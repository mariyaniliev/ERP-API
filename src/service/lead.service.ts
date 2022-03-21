import { PrismaClient, Prisma } from '@prisma/client'
import logger from '../utils/logger'

const prisma = new PrismaClient()

export async function createLead(userId: string) {
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

export async function findLead(id: string) {
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
      team: true,
    },
  })
  return lead
}

export async function getLeads() {
  const leads = await prisma.lead.findMany({
    include: {
      leadInfo: { select: { name: true, email: true, discord: true } },
      team: { select: { name: true, email: true, discord: true } },
    },
  })
  return leads
}

export async function updateLead(id: string, input: Prisma.LeadUpdateInput) {
  const updatedLead = await prisma.lead.update({ where: { id }, data: input })
  return updatedLead
}

export async function deleteLead(id: string) {
  const deleted = await prisma.lead.delete({ where: { id } })
  return deleted
}
