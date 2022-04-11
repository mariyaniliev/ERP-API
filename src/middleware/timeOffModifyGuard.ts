import { Request, Response, NextFunction } from 'express'

export const timeOffModifyGuard = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.timeOffRemainingDays) {
    return res.status(409).send('You cant modify time off days')
  }

  return next()
}
