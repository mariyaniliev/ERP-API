import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { createUser } from '../service/user.service'
import logger from '../utils/logger'

export async function createUserHandler(req: Request, res: Response) {
  try {
    const user = await createUser(req.body)
    return res.send(user)
  } catch (error) {
    const typedError = error as Prisma.PrismaClientKnownRequestError
    logger.error(typedError)
    return res.status(409).send(typedError?.message)
  }
}
