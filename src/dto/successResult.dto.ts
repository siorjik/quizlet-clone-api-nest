import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export default class SuccessResultDto {
  @ApiProperty()
  @IsBoolean()
  success: boolean
}
