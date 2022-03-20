import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { createLead, deleteLead, findLead, getLeads, updateLead } from '../service/lead.service'
import logger from '../utils/logger'
export async function createLeadHandler(
  req: Request<Record<string, unknown>, Record<string, unknown>, { userId: string }>,
  res: Response
) {
  const lead = await createLead(req.body.userId)

  return res.send(lead)
}
export async function getLeadHandler(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params
    const lead = await findLead(id)
    return res.send(lead)
  } catch (error) {
    const typedError = error as Prisma.PrismaClientKnownRequestError
    logger.error(typedError)
    return res.status(409).send(typedError?.message)
  }
}

export async function getLeadsHandler(req: Request, res: Response) {
  const leads = await getLeads()
  return res.send(leads)
}

export async function updateLeadHandler(
  req: Request<{ leadId: string }, Record<string, unknown>, Prisma.LeadUpdateInput>,
  res: Response
) {
  try {
    const { leadId } = req.params
    const input = req.body

    const lead = await findLead(leadId)
    if (!lead) {
      return res.sendStatus(404)
    }
    const updatedLead = await updateLead(lead.id, input)
    return res.send(updatedLead)
  } catch (error) {
    const typedError = error as Prisma.PrismaClientKnownRequestError
    logger.error(typedError)
    return res.status(409).send(typedError?.message)
  }
}

export async function deleteLeadHandler(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params
    const deletedLead = await deleteLead(id)
    return res.send(deletedLead)
  } catch (error) {
    const typedError = error as Prisma.PrismaClientKnownRequestError
    logger.error(typedError)
    return res.status(409).send(typedError?.message)
  }
}
