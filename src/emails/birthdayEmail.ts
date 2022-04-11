import sendEmail from './sendEmail'
import prisma from '../utils/client'

const isTodayBirthday = (userBirthday: string) => {
  const date1 = new Date(userBirthday)
  const date2 = new Date()
  const birthdayFormatDate1 = `${date1.getMonth() + 1}/${date1.getDate()}`
  const birthdayFormatDate2 = `${date2.getMonth() + 1}/${date2.getDate()}`
  if (birthdayFormatDate1 === birthdayFormatDate2) {
    return true
  }
  return false
}

const checkUsersForBirthdays = async () => {
  const subject = 'Happy Birthday'
  const text = 'This email aims to congratulate a user for his/her birthday'

  const users = await prisma.user.findMany({
    where: { NOT: [{ birthday: null }] },
    select: { birthday: true, email: true },
  })

  users.forEach((user) => {
    if (user.birthday && isTodayBirthday(user.birthday)) {
      sendEmail(user.email, subject, text)
    }
  })
}

export default checkUsersForBirthdays
