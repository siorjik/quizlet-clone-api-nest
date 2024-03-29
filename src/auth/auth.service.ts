import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as bcrypt from 'bcryptjs'

import LoginDto from './dto/login.dto'
import SessionService from '@/entities/token/token.service'
import ReturnTokenDto from '@/entities/token/dto/returnToken.dto'
import Token from '@/entities/token/schemas/token.schema'
import ReturnUserDto from '@/entities/user/dto/returnUser.dto'
import UserService from '@/entities/user/user.service'

@Injectable()
export default class AuthService {
  constructor(
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
    private readonly sessionService: SessionService,
    private readonly userService: UserService
  ){}

  async removeExpiredSessions(): Promise<void> {
    await this.tokenModel.deleteMany({ expireAt: { $lte: new Date() } })
  }

  async login(data: LoginDto): Promise<ReturnUserDto & ReturnTokenDto> {
    try {
      await this.removeExpiredSessions()

      const { email, password } = data
  
      const { user, password: userPass } = await this.userService.getOneByEmail(email)
  
      if (user && userPass) {
        const isValidPass = await bcrypt.compare(password, userPass)
  
        if (isValidPass) {
          const tokens = await this.sessionService.generateTokens({ user: { _id: user._id, email: user.email } })

          return { ...user, ...tokens }
        }
      }
      
      throw new BadRequestException('Invalid credentials...')
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async loginByProvider({ email, name }: { email: string, name: string }): Promise<ReturnUserDto & ReturnTokenDto> {
    try {
      await this.removeExpiredSessions()

      let result: ReturnUserDto

      const { user, password } = await this.userService.getOneByEmail(email)

      if (user) {
        if (!user.isAuthProvider && password) result = await this.userService.update({ _id: user._id, isAuthProvider: true })

        result = user
      } else result = await this.userService.createByProvider({ email, name })

      const tokens = await this.sessionService.generateTokens({ user: { _id: result._id, email: result.email } })

      return { ...result, ...tokens }
    } catch (error) {
      throw error
    }
  }
}
