import { Request, Response } from 'express'
import { Prisma, TimeOffTypes } from '@prisma/client'
import { TimeOffService } from '../service/timeoff.service'
import { errorMessage } from '../utils/prismaerror.utils'
import { calculateTimeOffDays } from '../utils/calculateTimeOffDays'
import logger from '../utils/logger'

export class TimeOffController {
  static async createTimeOffHandler(
    req: Request<{ userId: string }, Record<string, unknown>, Prisma.TimeOffCreateInput>,
    res: Response
  ) {
    try {
      const { userId } = req.params
      const input = req.body
      if ((input.approved === true || input.uploaded === true) && res.locals.user.authority !== 'Admin') {
        return res.sendStatus(403)
      }
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
  static async searchTimeOffsHandler(
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      Record<string, unknown>,
      {
        period?: string
        type?: TimeOffTypes
        approved?: string
        page?: string
        limit?: string
        emailOrName?: string
      }
    >,
    res: Response
  ) {
    try {
      const results = await TimeOffService.searchTimeOffs(req.query)
      return res.send(results)
    } catch (error) {
      const typedError = error as Prisma.PrismaClientKnownRequestError
      logger.error(typedError)
      return res.status(409).send(errorMessage(typedError))
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
      if ((input.approved === true || input.uploaded === true) && res.locals.user.authority !== 'Admin') {
        return res.sendStatus(403)
      }

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
  static async calculateDaysHandler(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.body
      const { count } = await calculateTimeOffDays(startDate, endDate, true)
      return res.send({ count })
    } catch (error) {
      return res.status(409).send(error)
    }
  }
}
