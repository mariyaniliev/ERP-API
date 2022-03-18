import { omit } from 'lodash'
import bcrypt from 'bcrypt'
import { PrismaClient, User } from '@prisma/client'
import { Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export async function createUser(input: Prisma.UserCreateInput): Promise<User> {
  try {
    const user = await prisma.user.create({ data: input })
    return user
  } catch (error: any) {
    throw new Error(error)
  }
}

export async function validatePassword({ email }: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return false
  /*   const isValid = await comparePassword(password, user.password);
  if (!isValid) return false; */
  return omit(user, 'password')
}

export async function comparePassword(candidatePassword: string, userPassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, userPassword).catch(() => false)
}

export async function findUser(query: { id: string }): Promise<User | null> {
  return prisma.user.findFirst({ where: query })
}
