import { MiddlewareConsumer, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { config } from 'dotenv'

import UserModule from './entities/user/user.module'
import SetModule from './entities/set/set.module'
import TokenModule from './entities/token/token.module'

import AuthModule from './auth/auth.module'
import MailerModule from './mailer/mailer.module'

import LoggerMiddleware from './logger/logger.middleware'

config({ path: `.env.${process.env.NODE_ENV}` })

@Module({
  imports: [MongooseModule.forRoot(process.env.DB_URL), UserModule, SetModule, AuthModule, TokenModule, MailerModule],
  controllers: [],
  providers: [],
})

export default class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
