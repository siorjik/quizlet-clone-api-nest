import { Post, Body, Controller, HttpCode, HttpStatus, Query, Get, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'

import AuthService from './auth.service'
import ReturnUserDto from '@/entities/user/dto/returnUserDto'
import User from '@/entities/user/schemas/user.schema'
import LoginDto from './dto/login.dto'
import BadRequestDto from '@/dto/badRequest.dto'
import ReturnTokenDto from '@/entities/token/dto/returnToken.dto'
import TokenService from '@/entities/token/token.service'
import UnauthorizedDto from '@/dto/unauthorized.dto'
import DeleteResultDto from '@/dto/deleteResult.dto'
import { JwtAuthGuard } from './auth.guard'

@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService, private readonly tokenService: TokenService) { }

  @ApiTags('Auth')
  @ApiResponse({ status: 200, type: ReturnUserDto })
  @ApiBadRequestResponse({ status: 400, type: BadRequestDto })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() data: LoginDto): Promise<Omit<User, 'password'> & ReturnTokenDto> {
    return await this.authService.login(data)
  }

  @ApiTags('Auth')
  @ApiResponse({ status: 200, type: ReturnTokenDto })
  @ApiUnauthorizedResponse({ status: 401, type: UnauthorizedDto })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'refresh', description: 'refresh token' })
  @Get('refresh')
  async refresh(@Query('refresh') refresh: string): Promise<ReturnTokenDto> {
    return await this.tokenService.updateTokens(refresh)
  }

  @ApiTags('Auth')
  @ApiResponse({ status: 200, type: ReturnUserDto })
  @ApiUnauthorizedResponse({ status: 401, type: UnauthorizedDto })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'refresh', description: 'refresh token' })
  @Get('logout')
  async logout(@Query('refresh') refresh: string): Promise<DeleteResultDto> {
    return await this.tokenService.removeToken(refresh)
  }
}
