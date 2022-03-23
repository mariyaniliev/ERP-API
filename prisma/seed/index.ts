import { usersSeed } from './user.seed'

import prisma from '../../src/utils/client'

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
