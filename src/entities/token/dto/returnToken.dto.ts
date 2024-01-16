import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsString } from 'class-validator'

export default class ReturnTokenDto {
  @ApiProperty()
  @IsString()
  accessToken: string

  @ApiProperty()
  @IsString()
  refreshToken: string

  @ApiProperty()
  @IsDate()
  accessExpire: Date
}
