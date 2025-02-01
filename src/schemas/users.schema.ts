import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<Users>;

@Schema({ timestamps: true })
export class Users {
  @Prop()
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refreshToken: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
