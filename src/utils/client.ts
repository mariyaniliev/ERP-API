import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { calculateTimeOffDays } from './calculateTimeOffDays'
import logger from '../utils/logger'
import { validateRoles } from './validateRoles'
const prisma = new PrismaClient()

prisma.$use(async (params, next) => {
  // * Password should be hashed before saving into database
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
  // * We want to store only unique roles in the array, so if there are duplicates, we remove them.
  if ((params.action === 'create' || params.action === 'update') && params.model === 'User' && params.args.data.roles) {
    const modifiedRoles = validateRoles(params.args.data.roles)
    params.args.data.roles = modifiedRoles
  }

  // * If we create new time off, we calculate how many days we should subtract from user's remaining time off days
  if (params.action === 'create' && params.model === 'TimeOff') {
    const startDate = params.args.data.startDate
    const endDate = params.args.data.endDate
    const userId = params.args.data.user.connect.id

    const { count: timeOffDaysCount, timeOffDays } = await calculateTimeOffDays(startDate, endDate)
    if (timeOffDaysCount === 0) {
      throw new Error('You are trying to book 0 days.\nPlease check if requested dates are business days')
    }
    const user = await prisma.user.findFirst({ where: { id: userId } })

    if (user) {
      // * Checks if some of the selected dates is already booked.
      const timeOffsHolder = await prisma.approvedTimeOffsHolder.findFirst({ include: { dates: true } })
      const alreadyBookedDates: string[] = []
      if (timeOffsHolder) {
        timeOffsHolder.dates.forEach((date) => {
          alreadyBookedDates.push(...date.dates)
        })
      }

      const selectedTimeOffDays: string[] = [...timeOffDays]
      selectedTimeOffDays.forEach((selectedDay) => {
        alreadyBookedDates.forEach((existingDay) => {
          if (selectedDay === existingDay) {
            throw new Error(`${selectedDay} is already booked.`)
          }
        })
      })

      if (user.timeOffRemainingDays - timeOffDaysCount <= 0) {
        throw new Error('Remaining time off days are not enough!')
      }
    }
  }
  if (params.action === 'update' && params.model === 'TimeOff') {
    if (params.args.data.approved === true) {
      const timeOffId = params.args.where.id

      const timeOff = await prisma.timeOff.findFirst({ where: { id: timeOffId } })
      if (!timeOff) {
        throw new Error('Time off not found.')
      }
      const { userId, startDate, endDate } = timeOff

      const user = await prisma.user.findFirst({ where: { id: userId } })
      if (user) {
        const { count: timeOffDaysCount, timeOffDays } = await calculateTimeOffDays(startDate, endDate)

        const timeOffsHolder = await prisma.approvedTimeOffsHolder.findFirst({ include: { dates: true } })

        if (!timeOffsHolder) {
          throw new Error('Time offs holder is not created yet')
        }
        const alreadyBookedDates: string[] = []
        timeOffsHolder.dates.forEach((date) => {
          alreadyBookedDates.push(...date.dates)
        })

        const selectedTimeOffDays: string[] = [...timeOffDays]
        selectedTimeOffDays.forEach((selectedDay) => {
          alreadyBookedDates.forEach((existingDay) => {
            if (selectedDay === existingDay) {
              throw new Error(`${selectedDay} is already booked.`)
            }
          })
        })

        if (user.timeOffRemainingDays - timeOffDaysCount <= 0) {
          throw new Error('Remaining time off days are not enough!')
        }

        await prisma.approvedTimeOff.create({
          data: { userId, holder: { connect: { id: timeOffsHolder.id } }, dates: [...selectedTimeOffDays] },
        })

        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            timeOffRemainingDays: user.timeOffRemainingDays - timeOffDaysCount,
            timeOffDates: { push: [...selectedTimeOffDays] },
          },
        })

        logger.info(`${updatedUser.name} day off remaining days are now ${updatedUser.timeOffRemainingDays}`)
      }
    }
  }

  return next(params)
})

export default prisma
