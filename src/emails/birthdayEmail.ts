import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import logger from '../utils/logger'
import prisma from '../utils/client'

const sendBirthdayEmail = (targetEmail: string) => {
  const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  })

  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: targetEmail,
    subject: 'Happy Birthday',
    text: 'This email aims to congratulate a user for his/her birthday',
  }

  transporter.sendMail(mailOptions, (err, info: SMTPTransport.SentMessageInfo) => {
    if (err) {
      logger.error(err)
    } else {
      logger.info(info)
    }
  })
}

const isTodayBirthday = (userBirthday: Date) => {
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
  const users = await prisma.user.findMany({
    where: { NOT: [{ birthday: null }] },
    select: { birthday: true, email: true },
  })

  users.forEach((user) => {
    if (user.birthday && isTodayBirthday(user.birthday)) {
      sendBirthdayEmail(user.email)
    }
  })
}

export default checkUsersForBirthdays
