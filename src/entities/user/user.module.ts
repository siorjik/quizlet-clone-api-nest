import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import User, { UserSchema } from './schemas/user.schema'
import UserService from './user.service'
import UserController from './user.controller'
import MailerModule from '@/mailer/mailer.module'
import TokenModule from '../token/token.module'

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), MailerModule, TokenModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})

export default class UserModule {}
