import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsString, MinLength, IsArray, IsMongoId, ValidateNested } from 'class-validator'

class SetItem {
  @IsString()
  term: string

  @IsString()
  definition: string
}

export default class CreateSetDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  title: string
  
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SetItem)
  list: SetItem[]

  @ApiProperty()
  @IsMongoId()
  userId: string

  @ApiProperty()
  @IsString()
  @MinLength(1)
  source: string

  @ApiProperty()
  @IsString()
  @MinLength(1)
  target: string
}
