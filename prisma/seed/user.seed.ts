import { PrismaClient } from '@prisma/client'
import faker from '@faker-js/faker'
const prisma = new PrismaClient()

export async function usersSeed() {
  console.log('Users Seed')

  const insert = await prisma.user.createMany({
    data: [...Array(5).keys()].map(() => ({
      email: faker.internet.email(),
      name: faker.name.firstName() + ' ' + faker.name.lastName(),
      password: faker.internet.password(),
      discord: faker.internet.userName(),
      phone: faker.phone.phoneNumber(),
    })),
    skipDuplicates: true,
  })
  console.log({ insert })
}
