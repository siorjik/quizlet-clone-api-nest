import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'

import SetService from './set.service'
import ReturnSetDto from './dto/returnSet.dto'
import CreateSetDto from './dto/createSet.dto'
import Set from './schemas/set.schema'
import DeleteResultDto from '@/dto/deleteResult.dto'
import BadRequestDto from '@/dto/badRequest.dto'
import UpdateSetDto from './dto/updateSet.dto'
import ObjectIdPipe from '@/pipes/objectId.pipe'
import { JwtAuthGuard } from '../../auth/auth.guard'
import UnauthorizedDto from '@/dto/unauthorized.dto'

@Controller('sets')
export default class SetController {
  constructor(private readonly setService: SetService) {}

  @ApiTags('Set')
  @ApiResponse({ status: 201, type: ReturnSetDto })
  @ApiBadRequestResponse({ status: 400, type: BadRequestDto })
  @ApiUnauthorizedResponse({ status: 401, type: UnauthorizedDto })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createDto: CreateSetDto): Promise<Set> {
    return await this.setService.create(createDto)
  }

  @ApiTags('Set')
  @ApiResponse({ status: 200, type: [ReturnSetDto] })
  @ApiBadRequestResponse({ status: 400, type: BadRequestDto })
  @ApiUnauthorizedResponse({ status: 401, type: UnauthorizedDto })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'userId', description: 'mongo id' })
  @Get()
  async getByUserId(@Query('userId', ObjectIdPipe) userId: string): Promise<Set[]> {
    return await this.setService.getByUserId(userId)
  }

  @ApiTags('Set')
  @ApiResponse({ status: 200, type: ReturnSetDto })
  @ApiBadRequestResponse({ status: 400, type: BadRequestDto })
  @ApiUnauthorizedResponse({ status: 401, type: UnauthorizedDto })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Param('id', ObjectIdPipe) id: string,): Promise<Set> {
    return await this.setService.getById(id)
  }

  @ApiTags('Set')
  @ApiResponse({ status: 200, type: DeleteResultDto })
  @ApiBadRequestResponse({ status: 400, type: BadRequestDto })
  @ApiUnauthorizedResponse({ status: 401, type: UnauthorizedDto })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'id', description: 'mongo id' })
  @Delete(':id')
  async remove(@Param('id', ObjectIdPipe) id: string): Promise<DeleteResultDto> {
    return await this.setService.remove(id)
  }

  @ApiTags('Set')
  @ApiResponse({ status: 200, type: ReturnSetDto })
  @ApiBadRequestResponse({ status: 400, type: BadRequestDto })
  @ApiUnauthorizedResponse({ status: 401, type: UnauthorizedDto })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@Body() updateDto: UpdateSetDto): Promise<Set> {
    return await this.setService.update(updateDto)
  }
}
