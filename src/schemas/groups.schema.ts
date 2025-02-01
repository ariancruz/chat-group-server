import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as SchemaM, Types } from 'mongoose';
import { Users } from './user.schema';

export type GroupsDocument = HydratedDocument<Groups>;

@Schema({ timestamps: true })
export class Groups {
  @Prop()
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    type: [{ type: SchemaM.Types.ObjectId, ref: 'Users' }],
  })
  users: Users[];
}

export const GroupsSchema = SchemaFactory.createForClass(Groups);
