import { Model } from 'mongoose'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { Set } from './schemas/set.schema'
import CreateSetDto from './dto/createSet.dto'
import DeleteResultDto from '@dto/deleteResult.dto'
import UpdateSetDto from './dto/updateSet.dto'

@Injectable()
export default class SetService {
  constructor(@InjectModel(Set.name) private setModel: Model<Set>) { }

  async create(createDto: CreateSetDto): Promise<Set> {
    try {
      const createdSet = new this.setModel(createDto)
  
      return createdSet.save()
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async getByUserId(userId: string): Promise<Set[]> {
    try {
      return await this.setModel.find({ userId })
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async getById(id: string): Promise<Set> {
    try {
      return await this.setModel.findById(id)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: string): Promise<DeleteResultDto> {
    try {
      return await this.setModel.deleteOne({ _id: id })
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async update(updateDto: UpdateSetDto): Promise<Set> {
    try {
      return await this.setModel.findOneAndUpdate({ _id: updateDto._id }, { ...updateDto }, { new: true })
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
