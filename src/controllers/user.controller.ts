import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { omit } from 'lodash'
import { UserService } from '../service/user.service'
import { SessionService } from '../service/session.service'
import { errorMessage } from '../utils/prismaerror.utils'
import { signJwt } from '../utils/jwt.utils'
import logger from '../utils/logger'

export class UserController {
  static async createUserHandler(
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
        if (res.locals.user && res.locals.user.authority !== 'Admin') {
          req.body.authority = undefined
        }
      }

      const user = await UserService.createUser(req.body, req.query.leadId)

      const session = await SessionService.createSession(user.id, req.get('user-agent') || '')

      const accessToken = signJwt({ ...user, session: session.id }, { expiresIn: process.env.JWT_TOKEN_TTL })

      const refreshToken = signJwt({ ...user, session: session.id }, { expiresIn: process.env.JWT_REFRESH_TOKEN_TTL })

      return res.send({ ...omit(user, 'password'), accessToken, refreshToken })
    } catch (error) {
      const typedError = error as Prisma.PrismaClientKnownRequestError
      logger.error(typedError)
      return res.status(409).send(errorMessage(typedError))
    }
  }
  static async getUsersHandler(
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      Record<string, unknown>,
      { page: string; limit: string }
    >,
    res: Response
  ) {
    const users = await UserService.getUsers(req.query)

    return res.send(users)
  }
  static async getUserHandler(req: Request, res: Response) {
    try {
      const user = await UserService.findUser({ id: req.params.id })

      return res.send(user)
    } catch (error) {
      const typedError = error as Prisma.PrismaClientKnownRequestError
      logger.error(typedError)
      return res.status(404).send(errorMessage(typedError))
    }
  }

  static async searchUsersHandler(
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      Record<string, unknown>,
      {
        emailOrName: string
        page?: string
        limit?: string
        leadId?: string
        birthday?: string
        startingDate?: string
        timeOffRemainingDays?: string
      }
    >,
    res: Response
  ) {
    try {
      const results = await UserService.searchUsers(req.query)
      return res.send(results)
    } catch (error) {
      const typedError = error as Prisma.PrismaClientKnownRequestError
      logger.error(typedError)
      return res.status(409).send(errorMessage(typedError))
    }
  }
  static async updateUserHandler(
    req: Request<{ id: string }, Record<string, unknown>, Prisma.UserUpdateInput, { leadId: string | undefined }>,
    res: Response
  ) {
    if (res.locals.user.authority !== 'Admin') {
      req.body.authority = undefined
      req.body.roles = undefined
    }

    try {
      const user = await UserService.updateUser(req.body, req.params.id, req.query.leadId)
      return res.send(omit(user, 'password'))
    } catch (error) {
      const typedError = error as Prisma.PrismaClientKnownRequestError
      logger.error(typedError)
      return res.status(409).send(errorMessage(typedError))
    }
  }
  static async deleteUserHandler(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params
      const deletedUser = await UserService.deleteUser(id)
      return res.send(deletedUser)
    } catch (error) {
      const typedError = error as Prisma.PrismaClientKnownRequestError
      logger.error(typedError)
      return res.status(404).send(errorMessage(typedError))
    }
  }
}
