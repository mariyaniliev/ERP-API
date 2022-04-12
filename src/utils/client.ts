import { PrismaClient } from '@prisma/client'
import { calculateTimeOffDays } from './calculateTimeOffDays'
import bcrypt from 'bcrypt'
import logger from '../utils/logger'
const prisma = new PrismaClient()

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
    const { count: timeOffDaysCount, timeOffDays } = await calculateTimeOffDays(startDate, endDate)
    if (timeOffDaysCount === 0) {
      throw new Error('You are trying to book 0 days.\nPlease check if requested dates are business days')
    }
    const userId = params.args.data.user.connect.id
    const user = await prisma.user.findFirst({ where: { id: userId } })

    if (user) {
      const selectedTimeOffDays: string[] = [...timeOffDays]
      const userTimeOffDays = user?.timeOffDates
      selectedTimeOffDays.forEach((selectedDay) => {
        userTimeOffDays.forEach((existingDay) => {
          if (selectedDay === existingDay) {
            throw new Error(`${selectedDay} is already booked.`)
          }
        })
      })

      if (user.timeOffRemainingDays - timeOffDaysCount <= 0) {
        throw new Error('Remaining time off days are not enough!')
      }

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

  return next(params)
})

export default prisma
