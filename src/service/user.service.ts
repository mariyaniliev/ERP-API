import { Prisma, User } from '@prisma/client'
import { omit } from 'lodash'
import bcrypt from 'bcrypt'
import logger from '../utils/logger'
import prisma from '../utils/client'
import { calculateTimeOffDays } from '../utils/calculateTimeOffDays'

prisma.$use(async (params, next) => {
  if (
    (params.action === 'create' || params.action === 'update') &&
    params.model === 'User' &&
    params.args.data.password
  ) {
    const saltRounds = Number(process.env.SALT_ROUNDS)
    const salt = await bcrypt.genSalt(saltRounds)
    const password = bcrypt.hashSync(params.args.data.password, salt)
    params.args.data.password = password
  }

  // * If we create new time off, we calculate how many days we should subtract from user's remaining time off days
  if (params.action === 'create' && params.model === 'TimeOff') {
    const startDate = params.args.data.startDate
    const endDate = params.args.data.endDate
    const timeOffDays = await calculateTimeOffDays(startDate, endDate)
    const userId = params.args.data.user.connect.id
    const user = await prisma.user.findFirst({ where: { id: userId } })
    if (user) {
      if (user.timeOffRemainingDays - timeOffDays <= 0) {
        throw new Error('Remaining time off days are not enough!')
      }
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { timeOffRemainingDays: user.timeOffRemainingDays - timeOffDays },
      })
      logger.info(`${updatedUser.name} day off remaining days are now ${updatedUser.timeOffRemainingDays}`)
    }
  }

  return next(params)
})

export async function createUser(input: Prisma.UserCreateInput, leadId?: string): Promise<User> {
  // * leadId is primary key from User model
  try {
    let query = { data: input }
    if (leadId) {
      query = {
        data: {
          ...input,
          lead: {
            connectOrCreate: {
              where: {
                id: leadId,
              },
              create: {
                leadInfo: {
                  connect: {
                    id: leadId,
                  },
                },
              },
            },
          },
        },
      }
    }

    const user = await prisma.user.create(query)
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

export async function getUsers(query: {
  page: string
  limit: string
}): Promise<{ data: Omit<User, 'password' | 'leading'>[]; resultsCount: number }> {
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10
  const startIndex = (page - 1) * limit
  const resultsCount = await prisma.user.count()

  const users = await prisma.user.findMany({
    skip: startIndex,
    take: limit,
    select: {
      id: true,
      email: true,
      name: true,
      enabled: true,
      authority: true,
      phone: true,
      discord: true,
      birthday: true,
      startingDate: true,
      alcohol: true,
      tshirtSize: true,
      createdAt: true,
      updatedAt: true,
      leadId: true,
      lead: {
        select: {
          leadInfo: {
            select: {
              name: true,
              email: true,
              discord: true,
            },
          },
        },
      },
      celebration: { select: { id: true, occasion: true, startDate: true, enabled: true } },
      timeOffRemainingDays: true,
    },
  })
  return { data: users, resultsCount }
}

export async function searchUsers(query: {
  emailOrName?: string
  page?: string
  limit?: string
  leadId?: string
  birthday?: string
  startingDate?: string
}) {
  const { emailOrName, leadId, birthday, startingDate } = query
  const limit = Number(query.limit) || 10
  const page = Number(query.page) || 1

  const startIndex = (page - 1) * limit

  const resultsCount = await prisma.user.count({
    where: {
      OR: [
        {
          email: {
            contains: emailOrName?.trim(),
            mode: 'insensitive',
          },
        },
        {
          name: {
            contains: emailOrName?.trim(),
            mode: 'insensitive',
          },
          lead: {
            id: leadId,
          },
          birthday: {
            contains: birthday?.trim(),
          },
          startingDate: {
            contains: startingDate?.trim(),
          },
        },
      ],
    },
  })
  const searchedUsers = await prisma.user.findMany({
    take: limit,
    skip: startIndex,
    where: {
      OR: [
        {
          email: {
            contains: emailOrName?.trim(),
            mode: 'insensitive',
          },
        },
        {
          name: {
            contains: emailOrName?.trim(),
            mode: 'insensitive',
          },
          lead: {
            id: leadId,
          },
          birthday: {
            contains: birthday?.trim(),
          },

          startingDate: {
            contains: startingDate?.trim(),
          },
        },
      ],
    },
    select: {
      id: true,
      email: true,
      name: true,
      enabled: true,
      authority: true,
      phone: true,
      discord: true,
      birthday: true,
      startingDate: true,
      alcohol: true,
      tshirtSize: true,
      createdAt: true,
      updatedAt: true,
      leadId: true,
      lead: {
        select: {
          leadInfo: {
            select: {
              name: true,
              email: true,
              discord: true,
            },
          },
        },
      },
      celebration: { select: { occasion: true, startDate: true, enabled: true } },
      timeOffRemainingDays: true,
    },
  })
  return { data: searchedUsers, resultsCount }
}

export async function findUser(query: { id: string }): Promise<User | null> {
  const user = prisma.user.findFirst({
    where: query,
    include: {
      lead: {
        select: {
          leadInfo: {
            select: {
              name: true,
              email: true,
              discord: true,
            },
          },
        },
      },
      celebration: true,
    },
  })

  return omit(user, 'password')
}

export async function updateUser(input: Prisma.UserUpdateInput, id: string, leadId?: string): Promise<User> {
  try {
    let query = input
    if (leadId) {
      query = {
        ...input,
        lead: {
          connectOrCreate: {
            where: {
              id: leadId,
            },
            create: {
              leadInfo: {
                connect: {
                  id: leadId,
                },
              },
            },
          },
        },
      }
    }

    const user = await prisma.user.update({ where: { id }, data: query })

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

export async function deleteUser(id: string) {
  const deletedUser = await prisma.user.delete({ where: { id } })
  return deletedUser
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
