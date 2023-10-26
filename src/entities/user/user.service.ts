import { Model } from 'mongoose'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { User } from './schemas/user.schema'
import CreateUserDto from './dto/createUserDto'

@Injectable()
export default class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>){}

  async create(createDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this.userModel(createDto)
  
      return createdUser.save()
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async getAll(): Promise<User[]> {
    try {
      return this.userModel.find().exec()
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
