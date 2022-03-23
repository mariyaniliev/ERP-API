import { get } from 'lodash'
import { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'
import { reIssueAccessToken } from '../service/session.service'
import { errorMessage } from '../utils/prismaerror.utils'
import { verifyJwt } from '../utils/jwt.utils'
import logger from '../utils/logger'

export const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = get(req, 'headers.authorization', '').replace(/^Bearer\s/, '')

  const refreshToken = get(req, 'headers.x-refresh', '').replace(/^Bearer\s/, '')
  if (!accessToken) {
    return next()
  }

  const { decoded, expired } = verifyJwt(accessToken)

  if (decoded) {
    res.locals.user = decoded
    return next()
  }

  if (expired && refreshToken) {
    try {
      const newAccessToken = await reIssueAccessToken(refreshToken)

      if (!newAccessToken) {
        return res.status(403)
      }
      res.setHeader('x-access-token', newAccessToken)

      const result = verifyJwt(newAccessToken)

      res.locals.user = result.decoded
    } catch (error) {
      const typedError = error as Prisma.PrismaClientKnownRequestError
      logger.error(typedError)
      return res.status(500).send(errorMessage(typedError))
    }

    return next()
  }

  return next()
}
