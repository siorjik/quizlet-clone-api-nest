import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import User, { UserSchema } from '@/entities/user/schemas/user.schema'
import AuthController from './auth.controller'
import AuthService from './auth.service'
import TokenModule from '@/entities/token/token.module'
import JwtStrategy from './auth.strategy'

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), TokenModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})

export default class AuthModule { }
