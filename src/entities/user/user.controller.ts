import { Post, Body, Get, UseGuards } from '@nestjs/common'
import { Controller } from '@nestjs/common'

import UserService from './user.service'
import CreateUserDto from './dto/createUserDto'
import User from './schemas/user.schema'
import { ApiBearerAuth, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import ReturnUserDto from './dto/returnUserDto'
import UnauthorizedDto from '@/dto/unauthorized.dto'
import { JwtAuthGuard } from 'src/auth/auth.guard'

@Controller('users')
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
  @ApiUnauthorizedResponse({ status: 401, type: UnauthorizedDto })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(): Promise<User[]> {
    return await this.userService.getAll()
  }
}
