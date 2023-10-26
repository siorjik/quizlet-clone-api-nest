import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength, IsArray } from 'class-validator'

export default class ReturnSetDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  title: string

  @ApiProperty()
  @IsArray()
  list: { term: string, definition: string }[]
  
  @ApiProperty()
  @IsString()
  userId: string

  @ApiProperty()
  @IsString()
  createdAt: string

  @ApiProperty()
  @IsString()
  updatedAt: string
}
