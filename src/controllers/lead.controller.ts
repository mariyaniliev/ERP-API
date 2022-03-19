import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { createLead, deleteLead, findLead, getLeads, updateLead } from '../service/lead.service'
export async function createLeadHandler(
  req: Request<Record<string, unknown>, Record<string, unknown>, { leadId: string }>,
  res: Response
) {
  const lead = await createLead(req.body.leadId)

  return res.send(lead)
}
export async function getLeadHandler(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params
  const lead = await findLead(id)
  return res.send(lead)
}

export async function getLeadsHandler(req: Request, res: Response) {
  const leads = await getLeads()
  return res.send(leads)
}

export async function updateLeadHandler(
  req: Request<{ leadId: string }, Record<string, unknown>, Prisma.LeadUpdateInput>,
  res: Response
) {
  const { leadId } = req.params
  const input = req.body

  const lead = await findLead(leadId)
  if (!lead) {
    return res.sendStatus(404)
  }
  const updatedLead = await updateLead(lead.id, input)
  return res.send(updatedLead)
}

export async function deleteLeadHandler(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params
  const deletedLead = await deleteLead(id)
  return res.send(deletedLead)
}
