import { PrismaClient, Prisma } from '@prisma/client'
import logger from '../utils/logger'

const prisma = new PrismaClient()

export async function createTimeOff(input: Prisma.TimeOffCreateInput, userId: string) {
  try {
    const createdTimeOff = await prisma.timeOff.create({
      data: { ...input, user: { connect: { id: userId } } },
    })
    return createdTimeOff
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      logger.error(e.code + ' : ' + e.message)
    }
    throw e
  }
}

export async function findTimeOff(id: string) {
  try {
    const timeOff = await prisma.timeOff.findFirst({ where: { id }, include: { user: true } })
    return timeOff
  } catch (e) {
    throw e
  }
}

export async function getTimeOffs() {
  const timeOffs = await prisma.timeOff.findMany({ include: { user: { select: { name: true } } } })
  return timeOffs
}

export async function updateTimeOff(id: string, input: Prisma.LeadUpdateInput) {
  try {
    const updatedTimeOff = await prisma.timeOff.update({ where: { id }, data: input })
    return updatedTimeOff
  } catch (e) {
    throw e
  }
}

export async function deleteTimeOff(id: string) {
  try {
    const deletedTimeOff = await prisma.timeOff.delete({ where: { id } })
    return deletedTimeOff
  } catch (e) {
    throw e
  }
}
