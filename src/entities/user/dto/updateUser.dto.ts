import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, MinLength, IsBoolean, IsOptional } from 'class-validator'
import { ObjectId } from 'mongoose'

export default class UpdateUserDto {
  @ApiProperty()
  @IsString()
  _id: ObjectId

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @IsOptional()
  name?: string
  
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  password?: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  createdAt?: Date

  @ApiProperty()
  @IsString()
  @IsOptional()
  updatedAt?: Date

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isAuthProvider?: boolean
}
