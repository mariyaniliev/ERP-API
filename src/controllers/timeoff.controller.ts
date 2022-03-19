import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { createTimeOff, deleteTimeOff, findTimeOff, getTimeOffs, updateTimeOff } from '../service/timeoff.service'
export async function createTimeOffHandler(
  req: Request<{ userId: string }, Record<string, unknown>, Prisma.TimeOffCreateInput>,
  res: Response
) {
  const { userId } = req.params
  const lead = await createTimeOff(req.body, userId)

  return res.send(lead)
}
export async function getTimeOffHandler(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params
  const timeOff = await findTimeOff(id)
  return res.send(timeOff)
}

export async function getTimeOffsHandler(req: Request, res: Response) {
  const timeOffs = await getTimeOffs()
  return res.send(timeOffs)
}

export async function updateTimeOffHandler(
  req: Request<{ id: string }, Record<string, unknown>, Prisma.TimeOffUpdateInput>,
  res: Response
) {
  const { id } = req.params
  const input = req.body

  const timeOff = await findTimeOff(id)
  if (!timeOff) {
    return res.sendStatus(404)
  }
  const updatedTimeOff = await updateTimeOff(timeOff.id, input)
  return res.send(updatedTimeOff)
}

export async function deleteTimeOffHandler(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params
  const deletedTimeOff = await deleteTimeOff(id)
  return res.send(deletedTimeOff)
}
