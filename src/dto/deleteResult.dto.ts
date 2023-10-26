import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber } from 'class-validator'

export default class DeleteResultDto {
  @ApiProperty()
  @IsBoolean()
  acknowledged: boolean

  @ApiProperty()
  @IsNumber()
  deletedCount: number
}
