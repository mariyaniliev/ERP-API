import { Request, Response, NextFunction } from 'express'
import { findSession } from '../service/session.service'

export const requireUser = async (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user

  if (!user) return res.sendStatus(403)
  const session = await findSession({ userId: user.id, valid: true })

  if (!session) return res.sendStatus(403)

  return next()
}
