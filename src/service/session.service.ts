import { Session, Prisma } from '@prisma/client'
import { get } from 'lodash'
import { verifyJwt, signJwt } from '../utils/jwt.utils'
import { UserService } from './user.service'
import logger from '../utils/logger'
import prisma from '../utils/client'

export class SessionService {
  static async createSession(userId: string, userAgent: string): Promise<Session> {
    try {
      const session = await prisma.session.create({
        data: { userId, userAgent },
      })
      return session
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        logger.error(e.code + ' : ' + e.message)
      }
      throw e
    }
  }
  static async findSession(query: { userId: string; valid: boolean }): Promise<Session[]> {
    const session = await prisma.session.findMany({
      where: query,
    })
    return session
  }
  static async updateSession(query: { id: string }, input: Prisma.SessionUpdateInput): Promise<Session> {
    try {
      const newSession = await prisma.session.update({
        where: query,
        data: input,
      })
      return newSession
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2015') {
          logger.error('A related record could not be found.')
        }
      }
      throw e
    }
  }
  static async reIssueAccessToken(token: string): Promise<string | false> {
    const { decoded } = verifyJwt(token)

    if (!decoded || !get(decoded, 'session')) {
      return false
    }

    const session = await prisma.session.findFirst({
      where: { id: get(decoded, 'session') },
    })

    if (!session || !session.valid) return false

    const user = await UserService.findUser({ id: session.userId })

    if (!user) return false

    const accessToken = signJwt({ ...user, session: session.id }, { expiresIn: process.env.JWT_TOKEN_TTL })

    return accessToken
  }
}
