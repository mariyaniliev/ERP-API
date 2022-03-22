import { PrismaClient, Prisma, User, AuthorityTypes, TshirtSizes, AlcoholTypes } from '@prisma/client'
import { omit } from 'lodash'
import bcrypt from 'bcrypt'
import logger from '../utils/logger'

const prisma = new PrismaClient()

prisma.$use(async (params, next) => {
  if (params.action === 'create' && params.model === 'User') {
    const saltRounds = Number(process.env.SALT_ROUNDS)
    const salt = await bcrypt.genSalt(saltRounds)
    const password = bcrypt.hashSync(params.args.data.password, salt)
    params.args.data.password = password
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
      celebration: true,
      timeOffs: true,
    },
  })
  return { data: users, resultsCount }
}

export async function searchUsers(query: {
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
}) {
  const { email, name, phone, discord, leadId, tshirtSize, alcohol } = query
  const limit = Number(query.limit) || 10
  const enabled = query.enabled === 'true' ? true : query.enabled === 'false' ? false : undefined
  const authority = query.authority

  const searchedUsers = await prisma.user.findMany({
    take: limit,
    where: {
      enabled: enabled,
      lead: {
        id: leadId,
      },
      email: {
        contains: email?.trim(),
        mode: 'insensitive',
      },
      name: {
        contains: name?.trim(),
        mode: 'insensitive',
      },
      phone: {
        contains: phone?.trim(),
        mode: 'insensitive',
      },
      discord: {
        contains: discord?.trim(),
        mode: 'insensitive',
      },
      authority: {
        equals: authority,
      },
      tshirtSize: {
        equals: tshirtSize,
      },
      alcohol: {
        equals: alcohol,
      },
    },
  })
  return searchedUsers
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
      timeOffs: true,
    },
  })
  return omit(user, 'password')
}

export async function updateUser(input: Prisma.UserUpdateInput, id: string, leadId?: string): Promise<User> {
  try {
    let query = input
    if (leadId) {
      // HERE LEADID IS ACTUALLY THE ID OF THE USER MODEL
      const lead = await prisma.lead.findFirst({ where: { userId: leadId } })

      // * IF LEAD ID IS PROVIDED WHEN CREATING USER, WE NEED DIFFERENT QUERY TO CONNECT HIM TO THE RELATIVE MODEL
      query = { ...input, lead: { connect: { userId: leadId } } }
      if (!lead) {
        // * IF THE USER IS NOT A LEAD YET, WE MAKE HIM LEAD
        const newLead = await prisma.lead.create({ data: { leadInfo: { connect: { id: leadId } } } })
        // * WE MODIFY THE QUERY WITH THE NEW LEAD RELATION
        query = { ...input, lead: { connect: { userId: newLead.userId } } }
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
