import { PrismaClient, Prisma } from '@prisma/client'
import logger from '../utils/logger'

const prisma = new PrismaClient()

export async function createCelebration(input: Prisma.CelebrationCreateInput, userId: string) {
  try {
    const createdCelebration = await prisma.celebration.create({
      data: { ...input, user: { connect: { id: userId } } },
    })
    return createdCelebration
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      logger.error(e.code + ' : ' + e.message)
    }
    throw e
  }
}

export async function findCelebration(id: string) {
  try {
    const celebration = await prisma.celebration.findFirst({ where: { id }, include: { user: true } })
    return celebration
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2015') {
        logger.error('A related record could not be found.')
      }
    }
    throw e
  }
}

export async function getCelebrations() {
  const celebrations = await prisma.celebration.findMany({ include: { user: { select: { name: true } } } })
  return celebrations
}

export async function updateCelebration(id: string, input: Prisma.CelebrationUpdateInput) {
  try {
    const updatedCelebration = await prisma.celebration.update({ where: { id }, data: input })
    return updatedCelebration
  } catch (e) {
    throw e
  }
}

export async function deleteCelebration(id: string) {
  try {
    const deletedCelebration = await prisma.celebration.delete({ where: { id } })
    return deletedCelebration
  } catch (e) {
    throw e
  }
}
