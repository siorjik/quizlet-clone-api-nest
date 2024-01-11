import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import User from '@/entities/user/schemas/user.schema'
import LoginDto from './dto/login.dto'

@Injectable()
export default class AuthService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>){}

  async login(data: LoginDto): Promise<Omit<User, 'password'>> {
    try {
      const { email, password } = data
  
      const user = await this.userModel.findOne({ email }).lean()
  
      if (user) {
        const { password: userPass, ...restUser } = user
  
        if (userPass === password) return restUser
      }
      
      throw new BadRequestException('Invalid credentials...')
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
