import { Request, Response } from 'express'
import { AlcoholTypes, AuthorityTypes, Prisma, TshirtSizes } from '@prisma/client'
import { omit } from 'lodash'
import { createUser, deleteUser, findUser, getUsers, searchUsers, updateUser } from '../service/user.service'
import { createSession } from '../service/session.service'
import { errorMessage } from '../utils/prismaerror.utils'
import { signJwt } from '../utils/jwt.utils'
import logger from '../utils/logger'

export async function createUserHandler(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    Prisma.UserCreateInput,
    { leadId: string | undefined }
  >,
  res: Response
) {
  try {
    if (req.body.authority) {
      if (res.locals.user.authority !== 'Admin') {
        req.body.authority = undefined
      }
    }

    const user = await createUser(req.body, req.query.leadId)

    const session = await createSession(user.id, req.get('user-agent') || '')

    const accessToken = signJwt({ ...user, session: session.id }, { expiresIn: process.env.JWT_TOKEN_TTL })

    const refreshToken = signJwt({ ...user, session: session.id }, { expiresIn: process.env.JWT_REFRESH_TOKEN_TTL })

    return res.send({ ...omit(user, 'password'), accessToken, refreshToken })
  } catch (error) {
    const typedError = error as Prisma.PrismaClientKnownRequestError
    logger.error(typedError)
    return res.status(409).send(errorMessage(typedError))
  }
}

export async function getUsersHandler(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>,
    { page: string; limit: string }
  >,
  res: Response
) {
  const users = await getUsers(req.query)

  return res.send(users)
}

export async function getUserHandler(req: Request, res: Response) {
  try {
    const user = await findUser({ id: req.params.id })

    return res.send(user)
  } catch (error) {
    const typedError = error as Prisma.PrismaClientKnownRequestError
    logger.error(typedError)
    return res.status(404).send(errorMessage(typedError))
  }
}

export async function searchUsersHandler(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>,
    {
      email?: string
      name?: string
      phone?: string
      discord?: string
      page?: string
      limit?: string
      enabled?: string
      leadId?: string
      authority?: AuthorityTypes
      tshirtSize?: TshirtSizes
      alcohol?: AlcoholTypes
    }
  >,
  res: Response
) {
  try {
    const results = await searchUsers(req.query)
    return res.send(results)
  } catch (error) {
    const typedError = error as Prisma.PrismaClientKnownRequestError
    logger.error(typedError)
    return res.status(409).send(errorMessage(typedError))
  }
}

export async function updateUserHandler(
  req: Request<{ id: string }, Record<string, unknown>, Prisma.UserUpdateInput, { leadId: string | undefined }>,
  res: Response
) {
  if (res.locals.user.authority !== 'Admin') {
    req.body.authority = undefined
  }
  try {
    const user = await updateUser(req.body, req.params.id, req.query.leadId)
    return res.send(omit(user, 'password'))
  } catch (error) {
    const typedError = error as Prisma.PrismaClientKnownRequestError
    logger.error(typedError)
    return res.status(409).send(errorMessage(typedError))
  }
}
export async function deleteUserHandler(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params
    const deletedUser = await deleteUser(id)
    return res.send(deletedUser)
  } catch (error) {
    const typedError = error as Prisma.PrismaClientKnownRequestError
    logger.error(typedError)
    return res.status(404).send(errorMessage(typedError))
  }
}
