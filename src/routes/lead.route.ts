import { Router } from 'express'
import { createLeadHandler, deleteLeadHandler, getLeadHandler, getLeadsHandler } from '../controllers/lead.controller'
import { isAdmin } from '../middleware/isAdmin'

const router = Router()

// * Add new lead
router.post('/leads/:userId', isAdmin, createLeadHandler)
// * Return all leads
router.get('/leads', getLeadsHandler)
// * Return lead
router.get('/leads/:id', getLeadHandler)
// * Delete lead
router.delete('/leads/:id', isAdmin, deleteLeadHandler)

export default router
