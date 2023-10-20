import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string

  @Prop()
  password: string

  @Prop({ required: true })
  email: string
}

export const UserSchema = SchemaFactory.createForClass(User)
