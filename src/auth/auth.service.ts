import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import User from '@/entities/user/schemas/user.schema'
import LoginDto from './dto/login.dto'
import SessionService from '@/entities/token/token.service'
import ReturnTokenDto from '@/entities/token/dto/returnToken.dto'

@Injectable()
export default class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly sessionService: SessionService
  ){}

  async login(data: LoginDto): Promise<Omit<User, 'password'> & ReturnTokenDto> {
    try {
      const { email, password } = data
  
      const user = await this.userModel.findOne({ email }).lean()
  
      if (user) {
        const { password: userPass, ...restUser } = user
  
        if (userPass === password) {
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
