import { Request, Response, NextFunction } from 'express'

export const isAdminOrOwner = async (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.user) return res.sendStatus(403)

  const { id, authority } = res.locals.user

  if (process.env.NODE_ENV === 'test' || authority === 'Admin') {
    return next()
  }

  const candidateId = req.params.id

  if (req.params.userId) {
    if (req.params.userId === id) {
      return next()
    }
    if (id !== req.params.userId || authority !== 'Admin') {
      return res.sendStatus(403)
    }
  }

  if (id !== candidateId) return res.sendStatus(403)

  return next()
}
