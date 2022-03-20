import { PrismaClient, Prisma } from '@prisma/client'
import logger from '../utils/logger'

const prisma = new PrismaClient()

export async function createLead(userId: string) {
  try {
    const createdLead = await prisma.lead.create({
      data: { leaderInfo: { connect: { id: userId } } },
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
  try {
    const lead = await prisma.lead.findFirst({ where: { id }, include: { leaderInfo: true } })
    return lead
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2015') {
        logger.error('A related record could not be found.')
      }
    }
    throw e
  }
}

export async function getLeads() {
  const leads = await prisma.lead.findMany({
    include: {
      leaderInfo: { select: { name: true, email: true, discord: true } },
      team: { select: { name: true, email: true, discord: true } },
    },
  })
  return leads
}

export async function updateLead(id: string, input: Prisma.LeadUpdateInput) {
  try {
    const updatedLead = await prisma.lead.update({ where: { id }, data: input })
    return updatedLead
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2015') {
        logger.error('A related record could not be found.')
      }
    }
    throw e
  }
}

export async function deleteLead(id: string) {
  try {
    const deleted = await prisma.lead.delete({ where: { id } })
    return deleted
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2015') {
        logger.error('A related record could not be found.')
      }
    }
    throw e
  }
}
