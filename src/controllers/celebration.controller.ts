import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import {
  createCelebration,
  deleteCelebration,
  findCelebration,
  getCelebrations,
  updateCelebration,
} from '../service/celebration.service'
import logger from '../utils/logger'
export async function createCelebrationHandler(
  req: Request<{ userId: string }, Record<string, unknown>, Prisma.CelebrationCreateInput>,
  res: Response
) {
  try {
    const { userId } = req.params
    const celebration = await createCelebration(req.body, userId)

    return res.send(celebration)
  } catch (error) {
    const typedError = error as Prisma.PrismaClientKnownRequestError
    logger.error(typedError)
    return res.status(409).send(typedError?.message)
  }
}
export async function getCelebrationHandler(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params
    const celebration = await findCelebration(id)
    return res.send(celebration)
  } catch (error) {
    const typedError = error as Prisma.PrismaClientKnownRequestError
    logger.error(typedError)
    return res.status(404).send(typedError?.message)
  }
}

export async function getCelebrationsHandler(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>,
    { page: string; limit: string }
  >,
  res: Response
) {
  const celebrations = await getCelebrations(req.query)
  return res.send(celebrations)
}

export async function updateCelebrationHandler(
  req: Request<{ id: string }, Record<string, unknown>, Prisma.CelebrationUpdateInput>,
  res: Response
) {
  try {
    const { id } = req.params
    const input = req.body

    const celebration = await findCelebration(id)
    if (!celebration) {
      return res.sendStatus(404)
    }
    const updatedCelebration = await updateCelebration(celebration.id, input)
    return res.send(updatedCelebration)
  } catch (error) {
    const typedError = error as Prisma.PrismaClientKnownRequestError
    logger.error(typedError)
    return res.status(409).send(typedError?.message)
  }
}

export async function deleteCelebrationHandler(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params
    const deletedCelebration = await deleteCelebration(id)
    return res.send(deletedCelebration)
  } catch (error) {
    const typedError = error as Prisma.PrismaClientKnownRequestError
    logger.error(typedError)
    return res.status(404).send(typedError?.message)
  }
}
