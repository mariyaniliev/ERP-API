import { PrismaClient } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { get } from 'lodash'
import { verifyJwt, signJwt } from '../utils/jwt.utils'
import { findUser } from './user.service'
const prisma = new PrismaClient()

export async function createSession(userId: string, userAgent: string) {
  const session = await prisma.session.create({
    data: { userId, userAgent },
  })
  return session
}

export async function findSession(query: { userId: string; valid: boolean }) {
  const session = await prisma.session.findMany({
    where: query,
  })
  return session
}

export async function updateSession(query: { id: string }, input: Prisma.SessionUpdateInput) {
  const newSession = await prisma.session.update({
    where: query,
    data: input,
  })
  return newSession
}

export async function reIssueAccessToken(token: string) {
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

  const accessToken = signJwt({ ...user, session: session.id }, { expiresIn: '15m' })

  return accessToken
}
