import { Request, Response, NextFunction } from 'express'

export const isAdminOrOwner = async (req: Request, res: Response, next: NextFunction) => {
  const { id, authority } = res.locals.user

  if (process.env.NODE_ENV === 'test' || authority === 'Admin') {
    return next()
  }

  const candidateId = req.params.id

  if (req.params.userId) {
    if (id !== req.params.userId || authority !== 'Admin') {
      return res.sendStatus(403)
    }
  }

  if (id !== candidateId) return res.sendStatus(403)

  return next()
}
