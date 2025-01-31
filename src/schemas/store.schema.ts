import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Groups } from './groups.schema';

export type StoresDocument = HydratedDocument<Stores>;

@Schema()
export class Stores {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  data: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'group' })
  group: Groups;
}

export const StoresSchema = SchemaFactory.createForClass(Stores);
