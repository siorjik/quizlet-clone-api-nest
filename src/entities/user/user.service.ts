import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { User } from './schemas/user.schema'
import CreateUserDto from './dto/createUserDto'

@Injectable()
export default class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>){}

  async create(createDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createDto)

    return createdUser.save()
  }

  async getAll(): Promise<User[]> {
    return this.userModel.find().exec()
  }
}
