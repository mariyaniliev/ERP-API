import { Prisma } from '@prisma/client'
import { Request, Response } from 'express'
import { SessionService } from '../service/session.service'
import { UserAuthService } from '../service/user.service'
import { errorMessage } from '../utils/prismaerror.utils'
import { signJwt } from '../utils/jwt.utils'
import logger from '../utils/logger'
import { omit } from 'lodash'

export class SessionController {
  static async createUserSessionHandler(req: Request, res: Response) {
    try {
      const user = await UserAuthService.validatePassword(req.body)

      if (!user) return res.status(401).send('Invalid email or password')

      const session = await SessionService.createSession(user.id, req.get('user-agent') || '')

      const accessToken = signJwt({ ...user, session: session.id }, { expiresIn: process.env.JWT_TOKEN_TTL })

      const refreshToken = signJwt({ ...user, session: session.id }, { expiresIn: process.env.JWT_REFRESH_TOKEN_TTL })

      return res.send({
        ...omit(
          user,
          'password',
          'enabled',
          'timeOffRemainingDays',
          'authority',
          'alcohol',
          'createdAt',
          'updatedAt',
          'birthday',
          'startingDate',
          'phone',
          'discord',
          'leadId',
          'tshirtSize'
        ),
        accessToken,
        refreshToken,
      })
    } catch (error) {
      const typedError = error as Prisma.PrismaClientKnownRequestError
      logger.error(typedError)
      return res.status(409).send(errorMessage(typedError))
    }
  }
  static async getUserSessionHandler(req: Request, res: Response) {
    try {
      const userId = res.locals.user.id
      const sessions = await SessionService.findSession({ userId: userId, valid: true })
      return res.send(sessions)
    } catch (error) {
      const typedError = error as Prisma.PrismaClientKnownRequestError
      logger.error(typedError)
      return res.status(404).send(errorMessage(typedError))
    }
  }
  static async deleteSessionHandler(req: Request, res: Response) {
    try {
      const sessionId = res.locals.user.session

      await SessionService.updateSession({ id: sessionId }, { valid: false })
      return res.send({ accessToken: null, refreshToken: null })
    } catch (error) {
      const typedError = error as Prisma.PrismaClientKnownRequestError
      logger.error(typedError)
      return res.status(404).send(errorMessage(typedError))
    }
  }
}
