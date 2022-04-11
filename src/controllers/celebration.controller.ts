import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { CelebrationService } from '../service/celebration.service'
import { errorMessage } from '../utils/prismaerror.utils'
import logger from '../utils/logger'

export class CelebrationController {
  static async createCelebrationHandler(
    req: Request<{ userId: string }, Record<string, unknown>, Prisma.CelebrationCreateInput>,
    res: Response
  ) {
    try {
      const { userId } = req.params
      const query = { ...req.body, user: { connect: { id: userId } } }

      const celebration = await CelebrationService.createCelebration(query)

      return res.send(celebration)
    } catch (error) {
      const typedError = error as Prisma.PrismaClientKnownRequestError
      logger.error(typedError)
      return res.status(409).send(errorMessage(typedError))
    }
  }
  static async getCelebrationHandler(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params
      const celebration = await CelebrationService.findCelebration(id)
      return res.send(celebration)
    } catch (error) {
      const typedError = error as Prisma.PrismaClientKnownRequestError
      logger.error(typedError)
      return res.status(404).send(errorMessage(typedError))
    }
  }
  static async getCelebrationsHandler(
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      Record<string, unknown>,
      { page: string; limit: string }
    >,
    res: Response
  ) {
    const celebrations = await CelebrationService.getCelebrations(req.query)
    return res.send(celebrations)
  }
  static async updateCelebrationHandler(
    req: Request<{ id: string }, Record<string, unknown>, Prisma.CelebrationUpdateInput>,
    res: Response
  ) {
    try {
      const { id } = req.params
      const input = req.body

      const celebration = await CelebrationService.findCelebration(id)
      if (!celebration) {
        return res.sendStatus(404)
      }
      const updatedCelebration = await CelebrationService.updateCelebration(celebration.id, input)
      return res.send(updatedCelebration)
    } catch (error) {
      const typedError = error as Prisma.PrismaClientKnownRequestError
      logger.error(typedError)
      return res.status(409).send(errorMessage(typedError))
    }
  }
  static async deleteCelebrationHandler(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params
      const deletedCelebration = await CelebrationService.deleteCelebration(id)
      return res.send(deletedCelebration)
    } catch (error) {
      const typedError = error as Prisma.PrismaClientKnownRequestError
      logger.error(typedError)
      return res.status(404).send(errorMessage(typedError))
    }
  }
}
