import { Injectable } from '@nestjs/common'
import { MailerService as MailService } from '@nestjs-modules/mailer'

import SendEmailDto from './dto/sendMail.dto'

@Injectable()
export default class MailerService {
  constructor(private readonly mailerService: MailService) {}

  async sendMail(data: SendEmailDto) {
    const { subject, to, html } = data

    await this.mailerService.sendMail({
      to,
      from: {
        name: 'noreply@language-for-you.online',
        address: process.env.MAILER_USER,
      },
      subject,
      html
    })
  }
}