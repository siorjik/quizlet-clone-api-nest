import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, MinLength } from 'class-validator'
import { ObjectId } from 'mongoose'

export default class ReturnUserDto {
  @ApiProperty()
  @IsString()
  _id: ObjectId
  
  @ApiProperty()
  @IsString()
  @MinLength(1)
  name: string
  
  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  createdAt: string

  @ApiProperty()
  @IsString()
  updatedAt: string
}
