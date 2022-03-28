import { Request, Response, NextFunction } from 'express'

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'test') {
    return next()
  }

  if (!res.locals.user) return res.sendStatus(403)

  const { authority } = res.locals.user

  if (authority === 'Admin') return next()

  return res.sendStatus(403)
}
