import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function createSession(userId: string, userAgent: string) {
  const session = await prisma.session.create({
    data: { user: { connect: { id: userId } }, userAgent },
  })
  return session
}

export async function findSession(query: any) {
  return await prisma.session.findUnique({ where: query })
}
