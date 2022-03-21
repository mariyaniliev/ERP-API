import { Prisma } from '@prisma/client'
import { Request, Response } from 'express'
import { createSession, findSession, updateSession } from '../service/session.service'
import { validatePassword } from '../service/user.service'
import { signJwt } from '../utils/jwt.utils'
import logger from '../utils/logger'

export async function createUserSessionHandler(req: Request, res: Response) {
  try {
    const user = await validatePassword(req.body)

    if (!user) return res.status(401).send('Invalid email or password')

    const session = await createSession(user.id, req.get('user-agent') || '')

    const accessToken = signJwt({ ...user, session: session.id }, { expiresIn: process.env.JWT_TOKEN_TTL })

    const refreshToken = signJwt({ ...user, session: session.id }, { expiresIn: process.env.JWT_REFRESH_TOKEN_TTL })

    return res.send({ accessToken, refreshToken })
  } catch (error) {
    const typedError = error as Prisma.PrismaClientKnownRequestError
    logger.error(typedError)
    return res.status(409).send(typedError?.message)
  }
}

export async function getUserSessionHandler(req: Request, res: Response) {
  try {
    const userId = res.locals.user.id
    const sessions = await findSession({ userId: userId, valid: true })
    return res.send(sessions)
  } catch (error) {
    const typedError = error as Prisma.PrismaClientKnownRequestError
    logger.error(typedError)
    return res.status(404).send(typedError?.message)
  }
}

export async function deleteSessionHandler(req: Request, res: Response) {
  try {
    const sessionId = res.locals.user.session

    await updateSession({ id: sessionId }, { valid: false })
    return res.send({ accessToken: null, refreshToken: null })
  } catch (error) {
    const typedError = error as Prisma.PrismaClientKnownRequestError
    logger.error(typedError)
    return res.status(404).send(typedError?.message)
  }
}
