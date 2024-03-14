import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as schema } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true })
export default class User {
  @Prop({ auto: true })
  _id: schema.Types.ObjectId

  @Prop({ required: true })
  name: string

  @Prop({ default: null })
  password: string

  @Prop({ required: true })
  email: string

  @Prop({ default: false })
  isActive: boolean

  @Prop({ default: false })
  isAuthProvider: boolean

  @Prop()
  createdAt: Date

  @Prop()
  updatedAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
