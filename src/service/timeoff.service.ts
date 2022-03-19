import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export async function createTimeOff(input: Prisma.CelebrationCreateInput, userId: string) {
  const createdTimeOff = await prisma.lead.create({
    data: { ...input, user: { connect: { id: userId } } },
  })
  return createdTimeOff
}

export async function findTimeOff(id: string) {
  const timeOff = await prisma.timeOff.findFirst({ where: { id }, include: { user: true } })
  return timeOff
}

export async function getTimeOffs() {
  const timeOffs = await prisma.timeOff.findMany({ include: { user: true } })
  return timeOffs
}

export async function updateTimeOff(id: string, input: Prisma.LeadUpdateInput) {
  const updatedTimeOff = await prisma.timeOff.update({ where: { id }, data: input })
  return updatedTimeOff
}

export async function deleteTimeOff(id: string) {
  const deleted = await prisma.timeOff.delete({ where: { id } })
  return deleted
}
