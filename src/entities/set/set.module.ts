import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import Set, { SetSchema } from './schemas/set.schema'
import SetService from './set.service'
import SetController from './set.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: Set.name, schema: SetSchema }])],
  controllers: [SetController],
  providers: [SetService],
})

export default class SetModule {}
