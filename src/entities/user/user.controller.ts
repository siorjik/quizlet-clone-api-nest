import { Post, Body, Get } from '@nestjs/common'
import { Controller } from '@nestjs/common'

import UserService from './user.service'
import CreateUserDto from './dto/createUserDto'
import { User } from './schemas/user.schema'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import ReturnUserDto from './dto/returnUserDto'

@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiTags('User')
  @ApiResponse({ status: 201, type: ReturnUserDto })
  @Post()
  async create(@Body() createDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createDto)
  }

  @ApiTags('User')
  @ApiResponse({ status: 201, type: [ReturnUserDto] })
  @Get()
  async getAll(): Promise<User[]> {
    return await this.userService.getAll()
  }
}
