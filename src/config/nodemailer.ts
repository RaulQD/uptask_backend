import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const config = () => {
  return {
    service: process.env.MAILER_SERVICE,
    auth: {
          user: process.env.MAILER_EMAIL,
          pass: process.env.MAILER_SECRET_KEY
        }
    }
}

export const transporter = nodemailer.createTransport(config());