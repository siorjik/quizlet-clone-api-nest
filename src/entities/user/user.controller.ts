import { Post, Body, Get, UseGuards } from '@nestjs/common'
import { Controller } from '@nestjs/common'

import UserService from './user.service'
import CreateUserDto from './dto/createUser.dto'
import User from './schemas/user.schema'
import { ApiBearerAuth, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import ReturnUserDto from './dto/returnUser.dto'
import UnauthorizedDto from '@/dto/unauthorized.dto'
import { JwtAuthGuard } from 'src/auth/auth.guard'

@Controller('users')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiTags('User')
  @ApiResponse({ status: 201, type: ReturnUserDto })
  @Post()
  async create(@Body() createDto: CreateUserDto): Promise<ReturnUserDto> {
    return await this.userService.create(createDto)
  }

  @ApiTags('User')
  @ApiResponse({ status: 201, type: 'success' })
  @Post('create-password')
  async createPassword(@Body() data: { password: string, token: string }): Promise<ReturnUserDto> {
    return await this.userService.createPassword(data.password, data.token)
  }

  @ApiTags('User')
  @ApiResponse({ status: 201, type: 'success' })
  @Post('recover-password')
  async recoveryPassword(@Body() data: { email: string }): Promise<string> {
    return await this.userService.recoverPassword(data.email)
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
