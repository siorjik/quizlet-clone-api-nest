import { Post, Body, Get, UseGuards, Patch } from '@nestjs/common'
import { Controller } from '@nestjs/common'

import UserService from './user.service'
import CreateUserDto from './dto/createUser.dto'
import User from './schemas/user.schema'
import { ApiBadRequestResponse, ApiBearerAuth, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import ReturnUserDto from './dto/returnUser.dto'
import UnauthorizedDto from '@/dto/unauthorized.dto'
import { JwtAuthGuard } from 'src/auth/auth.guard'
import UpdateUserDto from './dto/updateUser.dto'
import BadRequestDto from '@/dto/badRequest.dto'
import UpdatePassDto from './dto/updatePass.dto'
import SuccessResultDto from '@/dto/successResult.dto'

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
  @ApiResponse({ status: 201, type: SuccessResultDto })
  @Post('create-password')
  async createPassword(@Body() data: { password: string, token: string }): Promise<ReturnUserDto> {
    return await this.userService.createPassword(data.password, data.token)
  }

  @ApiTags('User')
  @ApiResponse({ status: 201, type: 'success' })
  @Post('recover-password')
  async recoveryPassword(@Body() data: { email: string }): Promise<SuccessResultDto> {
    return await this.userService.recoverPassword(data.email)
  }

  @ApiTags('User')
  @ApiResponse({ status: 201, type: SuccessResultDto })
  @ApiUnauthorizedResponse({ status: 401, type: UnauthorizedDto })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Patch('update-password')
  async updatePassword(@Body() data: UpdatePassDto): Promise<SuccessResultDto> {
    return await this.userService.updatePassword(data)
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

  @ApiTags('User')
  @ApiResponse({ status: 201, type: [ReturnUserDto] })
  @ApiUnauthorizedResponse({ status: 401, type: UnauthorizedDto })
  @ApiBadRequestResponse({ status: 400, type: BadRequestDto })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@Body() data: UpdateUserDto): Promise<ReturnUserDto> {
    return await this.userService.update(data)
  }
}
