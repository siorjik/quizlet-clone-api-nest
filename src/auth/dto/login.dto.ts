import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, MinLength } from 'class-validator'

export default class LoginDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  password: string
  
  @ApiProperty()
  @IsEmail()
  email: string
}
