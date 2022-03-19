import { PrismaClient, Prisma, User } from '@prisma/client'
import { omit } from 'lodash'
import bcrypt from 'bcrypt'
import logger from '../utils/logger'

const prisma = new PrismaClient()

export async function createUser(input: Prisma.UserCreateInput): Promise<User> {
  try {
    const saltRounds = Number(process.env.SALT_ROUNDS)
    const salt = await bcrypt.genSalt(saltRounds)
    const password = bcrypt.hashSync(input.password, salt)

    const user = await prisma.user.create({ data: { ...input, password } })
    return user
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        logger.error('There is a unique constraint violation, a new user cannot be created with this email')
      }
    }
    throw e
  }
}

export async function getUsers(): Promise<User[]> {
  const users = await prisma.user.findMany({ include: { lead: true, celebration: true, timeOffs: true } })
  return users
}

export async function validatePassword({ email, password }: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return false
  const isValid = await comparePassword(password, user.password)
  if (!isValid) return false
  return omit(user, 'password')
}

export async function comparePassword(candidatePassword: string, userPassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, userPassword).catch(() => false)
}

export async function findUser(query: { id: string }): Promise<User | null> {
  return prisma.user.findFirst({ where: query, include: { lead: true, celebration: true, timeOffs: true } })
}
