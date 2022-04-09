import { Prisma } from '@prisma/client'
import logger from '../utils/logger'
import prisma from '../utils/client'

export class TimeOffService {
  static async createTimeOff(input: Prisma.TimeOffCreateInput, userId: string) {
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
  static async findTimeOff(id: string) {
    const timeOff = await prisma.timeOff.findFirst({
      where: { id },
      include: { user: { select: { name: true, email: true } } },
    })
    return timeOff
  }
  static async getTimeOffs(query: { page: string; limit: string }) {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const startIndex = (page - 1) * limit
    const resultsCount = await prisma.timeOff.count()
    const timeOffs = await prisma.timeOff.findMany({
      skip: startIndex,
      take: limit,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })
    return { data: timeOffs, resultsCount }
  }
  static async updateTimeOff(id: string, input: Prisma.LeadUpdateInput) {
    const updatedTimeOff = await prisma.timeOff.update({ where: { id }, data: input })
    return updatedTimeOff
  }
  static async deleteTimeOff(id: string) {
    const deletedTimeOff = await prisma.timeOff.delete({ where: { id } })
    return deletedTimeOff
  }
}
