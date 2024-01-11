import { Post, Body, Controller, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiBadRequestResponse, ApiResponse, ApiTags } from '@nestjs/swagger'

import AuthService from './auth.service'
import ReturnUserDto from '@/entities/user/dto/returnUserDto'
import User from '@/entities/user/schemas/user.schema'
import LoginDto from './dto/login.dto'
import BadRequestDto from '@/dto/badRequest.dto'

@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiTags('Auth')
  @ApiResponse({ status: 200, type: ReturnUserDto })
  @ApiBadRequestResponse({ status: 400, type: BadRequestDto })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() data: LoginDto): Promise<Omit<User, 'password'>> {
    return await this.authService.login(data)
  }
}
