import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'

import TokenService from './token.service'
import Token, { TokenSchema } from './schemas/token.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }])],
  providers: [TokenService, JwtService],
  exports: [TokenService]
})
export default class TokenModule { }
