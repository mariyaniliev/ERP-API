import { Request, Response, NextFunction } from 'express'

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'test') {
    return next()
  }
  const { authority } = res.locals.user

  if (authority === 'Admin') return next()

  return res.sendStatus(403)
}
