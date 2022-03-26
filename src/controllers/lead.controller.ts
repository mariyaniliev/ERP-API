import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { createLead, deleteLead, findLead, getLeads } from '../service/lead.service'
import { errorMessage } from '../utils/prismaerror.utils'
import logger from '../utils/logger'
export async function createLeadHandler(req: Request<{ userId: string }, Record<string, unknown>>, res: Response) {
  try {
    const lead = await createLead(req.params.userId)
    return res.send(lead)
  } catch (error) {
    const typedError = error as Prisma.PrismaClientKnownRequestError
    logger.error(typedError)
    return res.status(409).send(errorMessage(typedError))
  }
}
export async function getLeadHandler(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params
    const lead = await findLead(id)
    return res.send(lead)
  } catch (error) {
    const typedError = error as Prisma.PrismaClientKnownRequestError
    logger.error(typedError)
    return res.status(404).send(errorMessage(typedError))
  }
}

export async function getLeadsHandler(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>,
    { page: string; limit: string }
  >,
  res: Response
) {
  const leads = await getLeads(req.query)
  return res.send(leads)
}

export async function deleteLeadHandler(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params
    const deletedLead = await deleteLead(id)
    return res.send(deletedLead)
  } catch (error) {
    const typedError = error as Prisma.PrismaClientKnownRequestError
    logger.error(typedError)
    return res.status(404).send(errorMessage(typedError))
  }
}
