import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'

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
  
      const user = await this.userService.getOneByEmail(email)
  
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: userPass, ...restUser } = user
        const isValidPass = await bcrypt.compare(password, user.password)
  
        if (isValidPass) {
          const tokens = await this.sessionService.generateTokens({ _id: user._id, email: user.email })

          return { ...restUser, ...tokens }
        }
      }
      
      throw new BadRequestException('Invalid credentials...')
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
