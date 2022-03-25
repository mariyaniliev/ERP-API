import { Prisma } from '@prisma/client'
import logger from '../utils/logger'
import prisma from '../utils/client'

export async function createCelebration(query: Prisma.CelebrationCreateInput) {
  try {
    const createdCelebration = await prisma.celebration.create({ data: query })
    return createdCelebration
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      logger.error(e.code + ' : ' + e.message)
    }
    throw e
  }
}

export async function findCelebration(id: string) {
  const celebration = await prisma.celebration.findFirst({
    where: { id },
    include: { user: { select: { name: true, email: true } } },
  })
  return celebration
}

export async function getCelebrations(query: { page: string; limit: string }) {
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10
  const startIndex = (page - 1) * limit
  const resultsCount = await prisma.celebration.count()
  const celebrations = await prisma.celebration.findMany({
    skip: startIndex,
    take: limit,
    include: {
      user: {
        select: {
          name: true,
          birthday: true,
        },
      },
    },
  })
  return { data: celebrations, resultsCount }
}

export async function updateCelebration(id: string, input: Prisma.CelebrationUpdateInput) {
  const updatedCelebration = await prisma.celebration.update({ where: { id }, data: input })
  return updatedCelebration
}

export async function deleteCelebration(id: string) {
  const deletedCelebration = await prisma.celebration.delete({ where: { id } })
  return deletedCelebration
}
