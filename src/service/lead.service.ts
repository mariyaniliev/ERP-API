import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export async function createLead(userId: string) {
  const createdLead = await prisma.lead.create({
    data: { leaderInfo: { connect: { id: userId } } },
  })
  return createdLead
}

export async function findLead(id: string) {
  const lead = await prisma.lead.findFirst({ where: { id }, include: { leaderInfo: true } })
  return lead
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
  const updatedLead = await prisma.lead.update({ where: { id }, data: input })
  return updatedLead
}

export async function deleteLead(id: string) {
  const deleted = await prisma.lead.delete({ where: { id } })
  return deleted
}
