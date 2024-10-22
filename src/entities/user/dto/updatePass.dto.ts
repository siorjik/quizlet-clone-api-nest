import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength } from 'class-validator'
import { ObjectId } from 'mongoose'

export default class UpdatePassDto {
  @ApiProperty()
  @IsString()
  _id: ObjectId

  @ApiProperty()
  @IsString()
  @MinLength(1)
  currentPass: string

  @ApiProperty()
  @IsString()
  @MinLength(5)
  newPass: string
}
