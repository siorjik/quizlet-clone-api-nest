import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as schema } from 'mongoose'

import User from '@/entities/user/schemas/user.schema'

export type TokenDocument = HydratedDocument<Token>

@Schema({ timestamps: true })
export default class Token {
  @Prop({ auto: true })
  _id: schema.Types.ObjectId

  @Prop({ required: true })
  token: string

  @Prop({ type: schema.Types.ObjectId, ref: User.name, required: true })
  userId: User

  @Prop({ required: true, type: Date })
  expireAt: Date
}

export const TokenSchema = SchemaFactory.createForClass(Token)
