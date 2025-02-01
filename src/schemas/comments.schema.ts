import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Groups } from './groups.schema';
import { Users } from './users.schema';

export type CommentsDocument = HydratedDocument<Comments>;

@Schema({
  timestamps: true,
})
export class Comments {
  @Prop()
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  data: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Users' })
  user: Users;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Groups' })
  group: Groups;
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);
