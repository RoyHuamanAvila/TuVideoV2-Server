import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Channel } from '../channel/channel.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop()
  email: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Channel' })
  channel: Channel;
}
export const UserSchema = SchemaFactory.createForClass(User);
