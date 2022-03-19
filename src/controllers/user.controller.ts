import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { createUser, getUsers } from '../service/user.service'
import { createSession } from '../service/session.service'
import { signJwt } from '../utils/jwt.utils'
import logger from '../utils/logger'

export async function createUserHandler(req: Request, res: Response) {
  try {
    const user = await createUser(req.body)

    const session = await createSession(user.id, req.get('user-agent') || '')

    const accessToken = signJwt({ ...user, session: session.id }, { expiresIn: process.env.JWT_TOKEN_TTL })

    const refreshToken = signJwt({ ...user, session: session.id }, { expiresIn: process.env.JWT_REFRESH_TOKEN_TTL })

    res.set({
      Authorization: `Bearer ${accessToken}`,
      'x-refresh': `Bearer ${refreshToken}`,
    })
    return res.send(user)
  } catch (error) {
    const typedError = error as Prisma.PrismaClientKnownRequestError
    logger.error(typedError)
    return res.status(409).send(typedError?.message)
  }
}

export async function getUsersHandler(req: Request, res: Response) {
  const users = await getUsers()
  return res.send(users)
}
