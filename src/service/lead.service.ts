import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export async function createLead(leadId: string) {
  const createdLead = await prisma.lead.create({
    data: { user: { connect: { id: leadId } } },
  })
  return createdLead
}

export async function findLead(id: string) {
  const lead = await prisma.lead.findFirst({ where: { id: id.trim() }, include: { user: true } })
  return lead
}

export async function getLeads() {
  const leads = await prisma.lead.findMany({ include: { user: true } })
  return leads
}

export async function updateLead(id: string, input: Prisma.LeadUpdateInput) {
  const updatedLead = await prisma.lead.update({ where: { id: id.trim() }, data: input })
  return updatedLead
}

export async function deleteLead(id: string) {
  const deleted = await prisma.lead.delete({ where: { id } })
  return deleted
}
