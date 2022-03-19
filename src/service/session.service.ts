import { PrismaClient, Session, Prisma } from '@prisma/client'
import logger from '../utils/logger'
import { get } from 'lodash'
import { verifyJwt, signJwt } from '../utils/jwt.utils'
import { findUser } from './user.service'
const prisma = new PrismaClient()

export async function createSession(userId: string, userAgent: string): Promise<Session> {
  try {
    const session = await prisma.session.create({
      data: { userId, userAgent },
    })
    return session
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        logger.error('There is a unique constraint violation, a new user cannot be created with this email')
      }
    }
    throw e
  }
}

export async function findSession(query: { userId: string; valid: boolean }): Promise<Session[]> {
  const session = await prisma.session.findMany({
    where: query,
  })
  return session
}

export async function updateSession(query: { id: string }, input: Prisma.SessionUpdateInput): Promise<Session> {
  const newSession = await prisma.session.update({
    where: query,
    data: input,
  })
  return newSession
}

export async function reIssueAccessToken(token: string): Promise<string | false> {
  const { decoded } = verifyJwt(token)

  if (!decoded || !get(decoded, 'session')) {
    return false
  }
  const session = await prisma.session.findFirst({
    where: { id: get(decoded, 'session') },
  })

  if (!session || !session.valid) return false

  const user = await findUser({ id: session.userId })

  if (!user) return false

  const accessToken = signJwt({ ...user, session: session.id }, { expiresIn: process.env.JWT_TOKEN_TTL })

  return accessToken
}