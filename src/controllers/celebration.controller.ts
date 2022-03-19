import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import {
  createCelebration,
  deleteCelebration,
  findCelebration,
  getCelebrations,
  updateCelebration,
} from '../service/celebration.service'
export async function createCelebrationHandler(
  req: Request<{ userId: string }, Record<string, unknown>, Prisma.CelebrationCreateInput>,
  res: Response
) {
  const { userId } = req.params
  const celebration = await createCelebration(req.body, userId)

  return res.send(celebration)
}
export async function getCelebrationHandler(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params
  const celebration = await findCelebration(id)
  return res.send(celebration)
}

export async function getCelebrationsHandler(req: Request, res: Response) {
  const celebrations = await getCelebrations()
  return res.send(celebrations)
}

export async function updateCelebrationHandler(
  req: Request<{ id: string }, Record<string, unknown>, Prisma.CelebrationUpdateInput>,
  res: Response
) {
  const { id } = req.params
  const input = req.body

  const celebration = await findCelebration(id)
  if (!celebration) {
    return res.sendStatus(404)
  }
  const updatedCelebration = await updateCelebration(celebration.id, input)
  return res.send(updatedCelebration)
}

export async function deleteCelebrationHandler(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params
  const deletedCelebration = await deleteCelebration(id)
  return res.send(deletedCelebration)
}
