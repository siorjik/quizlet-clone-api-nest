import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import User, { UserSchema } from '@/entities/user/schemas/user.schema'
import AuthController from './auth.controller'
import AuthService from './auth.service'
import TokenModule from '@/entities/token/token.module'
import JwtStrategy from './auth.strategy'
import Token, { TokenSchema } from '@/entities/token/schemas/token.schema'
import UserModule from '@/entities/user/user.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: Token.name, schema: TokenSchema }]),
    TokenModule, UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})

export default class AuthModule { }
