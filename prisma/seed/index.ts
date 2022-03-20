import { PrismaClient } from '@prisma/client'

import { usersSeed } from './user.seed'

const prisma = new PrismaClient()

async function main() {
  await Promise.all([await usersSeed()])
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })