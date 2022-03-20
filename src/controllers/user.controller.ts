import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { omit } from 'lodash'
import { createUser, findUser, getUsers } from '../service/user.service'
import { createSession } from '../service/session.service'
import { signJwt } from '../utils/jwt.utils'
import logger from '../utils/logger'

export async function createUserHandler(
  req: Request<Record<string, unknown>, Record<string, unknown>, Prisma.UserCreateInput, { leadId: string }>,
  res: Response
) {
  try {
    const user = await createUser(req.body, req.query.leadId)

    const session = await createSession(user.id, req.get('user-agent') || '')

    const accessToken = signJwt({ ...user, session: session.id }, { expiresIn: process.env.JWT_TOKEN_TTL })

    const refreshToken = signJwt({ ...user, session: session.id }, { expiresIn: process.env.JWT_REFRESH_TOKEN_TTL })

    return res.send({ ...omit(user, 'password'), accessToken, refreshToken })
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

export async function getUserHandler(req: Request, res: Response) {
  const users = await findUser({ id: req.params.id })
  return res.send(users)
}
