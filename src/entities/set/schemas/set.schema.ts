import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as mongSchema } from 'mongoose'

import User from '@/entities/user/schemas/user.schema'

export type SetDocument = HydratedDocument<Set>

@Schema({ timestamps: true })
export default class Set {
  @Prop()
  title: string

  @Prop()
  list: { term: string, definition: string }[]

  @Prop({ type: mongSchema.Types.ObjectId, ref: User.name })
  userId: User
}

export const SetSchema = SchemaFactory.createForClass(Set)
