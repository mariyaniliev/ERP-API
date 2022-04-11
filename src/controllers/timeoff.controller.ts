import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { TimeOffService } from '../service/timeoff.service'
import { errorMessage } from '../utils/prismaerror.utils'
import logger from '../utils/logger'

export class TimeOffController {
  static async createTimeOffHandler(
    req: Request<{ userId: string }, Record<string, unknown>, Prisma.TimeOffCreateInput>,
    res: Response
  ) {
    try {
      const { userId } = req.params
      const timeOff = await TimeOffService.createTimeOff(req.body, userId)

      return res.send(timeOff)
    } catch (error) {
      const typedError = error as Prisma.PrismaClientKnownRequestError
      logger.error(typedError)
      return res.status(409).send(errorMessage(typedError))
    }
  }
  static async getTimeOffHandler(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params
      const timeOff = await TimeOffService.findTimeOff(id)
      return res.send(timeOff)
    } catch (error) {
      const typedError = error as Prisma.PrismaClientKnownRequestError
      logger.error(typedError)
      return res.status(404).send(errorMessage(typedError))
    }
  }
  static async getTimeOffsHandler(
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      Record<string, unknown>,
      { page: string; limit: string }
    >,
    res: Response
  ) {
    const timeOffs = await TimeOffService.getTimeOffs(req.query)
    return res.send(timeOffs)
  }
  static async updateTimeOffHandler(
    req: Request<{ id: string }, Record<string, unknown>, Prisma.TimeOffUpdateInput>,
    res: Response
  ) {
    try {
      const { id } = req.params
      const input = req.body

      const timeOff = await TimeOffService.findTimeOff(id)
      if (!timeOff) {
        return res.sendStatus(404)
      }
      const updatedTimeOff = await TimeOffService.updateTimeOff(timeOff.id, input)
      return res.send(updatedTimeOff)
    } catch (error) {
      const typedError = error as Prisma.PrismaClientKnownRequestError
      logger.error(typedError)
      return res.status(409).send(errorMessage(typedError))
    }
  }
  static async deleteTimeOffHandler(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params
      const deletedTimeOff = await TimeOffService.deleteTimeOff(id)
      return res.send(deletedTimeOff)
    } catch (error) {
      const typedError = error as Prisma.PrismaClientKnownRequestError
      logger.error(typedError)
      return res.status(404).send(errorMessage(typedError))
    }
  }
}
