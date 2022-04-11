import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import logger from '../utils/logger'

const sendEmail = (targetEmail: string, subject: string, text: string) => {
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
    subject,
    text,
  }

  transporter.sendMail(mailOptions, (err, info: SMTPTransport.SentMessageInfo) => {
    if (err) {
      logger.error(err)
    } else {
      logger.info(info)
    }
  })
}
export default sendEmail
