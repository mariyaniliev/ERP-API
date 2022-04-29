import { Prisma, User } from '@prisma/client'
import { omit } from 'lodash'
import bcrypt from 'bcrypt'
import logger from '../utils/logger'
import prisma from '../utils/client'

export class UserService {
  static async createUser(input: Prisma.UserCreateInput, leadId?: string): Promise<User> {
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

  static async getUsers(query: {
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
                id: true,
              },
            },
          },
        },
        celebration: { select: { id: true, occasion: true, startDate: true, enabled: true } },
        timeOffRemainingDays: true,
        timeOffDates: true,
        roles: true,
        position: true,
      },
    })
    return { data: users, resultsCount }
  }

  static async searchUsers(query: {
    emailOrName?: string
    page?: string
    limit?: string
    leadId?: string
    birthday?: string
    startingDate?: string
    timeOffRemainingDays?: string
  }) {
    const { emailOrName, leadId, birthday, startingDate } = query
    const timeOffRemainingDays = query.timeOffRemainingDays ? Number(query.timeOffRemainingDays) : undefined
    const limit = Number(query.limit) || 10
    const page = Number(query.page) || 1

    const startIndex = (page - 1) * limit

    const resultsCount = await prisma.user.count({
      where: {
        email: {
          contains: emailOrName?.trim(),
          mode: 'insensitive',
        },

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
        timeOffRemainingDays: {
          equals: timeOffRemainingDays,
        },
      },
    })
    const searchedUsers = await prisma.user.findMany({
      take: limit,
      skip: startIndex,
      where: {
        email: {
          contains: emailOrName?.trim(),
          mode: 'insensitive',
        },

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
        timeOffRemainingDays: {
          equals: timeOffRemainingDays,
        },
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
                id: true,
              },
            },
          },
        },
        celebration: { select: { occasion: true, startDate: true } },
        timeOffRemainingDays: true,
        timeOffDates: true,
        roles: true,
        position: true,
      },
    })
    return { data: searchedUsers, resultsCount }
  }

  static async findUser(query: { id: string }): Promise<User | null> {
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

  static async updateUser(input: Prisma.UserUpdateInput, id: string, leadId?: string): Promise<User> {
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

  static async deleteUser(id: string) {
    const deletedUser = await prisma.user.delete({ where: { id } })
    return deletedUser
  }
}

export class UserAuthService {
  static async comparePassword(candidatePassword: string, userPassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, userPassword).catch(() => false)
  }
  static async validatePassword({ email, password }: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return false
    const isValid = await this.comparePassword(password, user.password)
    if (!isValid) return false
    return omit(user, 'password')
  }
}
