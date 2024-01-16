import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as mongSchema } from 'mongoose'

import User from '@/entities/user/schemas/user.schema'

export type TokenDocument = HydratedDocument<Token>

@Schema({ timestamps: true })
export default class Token {
  @Prop({ required: true })
  token: string

  @Prop({ type: mongSchema.Types.ObjectId, ref: User.name, required: true })
  userId: User

  @Prop({ required: true, type: Date })
  expireAt: Date
}

export const TokenSchema = SchemaFactory.createForClass(Token)
