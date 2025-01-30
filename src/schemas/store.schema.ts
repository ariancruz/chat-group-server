import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type StoresDocument = HydratedDocument<Stores>;

@Schema()
export class Stores {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  mainPhoto: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'searchconfig' })
  searchConfigId: SearchConfig;
}

export const StoresSchema = SchemaFactory.createForClass(Stores);
