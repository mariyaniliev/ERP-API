import { Request, Response, NextFunction } from 'express'
import { findSession } from '../service/session.service'

export const requireUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.user) return res.sendStatus(403)

  const user = res.locals.user
  const session = await findSession({ userId: user.id, valid: true })

  if (!session) return res.sendStatus(403)

  return next()
}
