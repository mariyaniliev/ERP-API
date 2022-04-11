import { Router } from 'express'
import { LeadController } from '../controllers/lead.controller'
import { isAdmin } from '../middleware/isAdmin'

const router = Router()

// * Add new lead
router.post('/leads/:userId', isAdmin, LeadController.createLeadHandler)
// * Return all leads
router.get('/leads', LeadController.getLeadsHandler)
// * Return lead
router.get('/leads/:id', LeadController.getLeadHandler)
// * Delete lead
router.delete('/leads/:id', isAdmin, LeadController.deleteLeadHandler)

export default router
