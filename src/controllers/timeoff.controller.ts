import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { createTimeOff, deleteTimeOff, findTimeOff, getTimeOffs, updateTimeOff } from '../service/timeoff.service'
import { errorMessage } from '../utils/prismaerror.utils'
import logger from '../utils/logger'
export async function createTimeOffHandler(
  req: Request<{ userId: string }, Record<string, unknown>, Prisma.TimeOffCreateInput>,
  res: Response
) {
  try {
    const { userId } = req.params
    const timeOff = await createTimeOff(req.body, userId)

    return res.send(timeOff)
  } catch (error) {
    const typedError = error as Prisma.PrismaClientKnownRequestError
    logger.error(typedError)
    return res.status(409).send(errorMessage(typedError))
  }
}
export async function getTimeOffHandler(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params
    const timeOff = await findTimeOff(id)
    return res.send(timeOff)
  } catch (error) {
    const typedError = error as Prisma.PrismaClientKnownRequestError
    logger.error(typedError)
    return res.status(404).send(errorMessage(typedError))
  }
}

export async function getTimeOffsHandler(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>,
    { page: string; limit: string }
  >,
  res: Response
) {
  const timeOffs = await getTimeOffs(req.query)
  return res.send(timeOffs)
}

export async function updateTimeOffHandler(
  req: Request<{ id: string }, Record<string, unknown>, Prisma.TimeOffUpdateInput>,
  res: Response
) {
  try {
    const { id } = req.params
    const input = req.body

    const timeOff = await findTimeOff(id)
    if (!timeOff) {
      return res.sendStatus(404)
    }
    const updatedTimeOff = await updateTimeOff(timeOff.id, input)
    return res.send(updatedTimeOff)
  } catch (error) {
    const typedError = error as Prisma.PrismaClientKnownRequestError
    logger.error(typedError)
    return res.status(409).send(errorMessage(typedError))
  }
}

export async function deleteTimeOffHandler(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params
    const deletedTimeOff = await deleteTimeOff(id)
    return res.send(deletedTimeOff)
  } catch (error) {
    const typedError = error as Prisma.PrismaClientKnownRequestError
    logger.error(typedError)
    return res.status(404).send(errorMessage(typedError))
  }
}
