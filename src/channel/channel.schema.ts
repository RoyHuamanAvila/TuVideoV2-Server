import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { User } from '../user/user.schema';
import { Video } from '../video/video.schema';

export type ChannelDocument = HydratedDocument<Channel>;

@Schema({
  autoIndex: true,
  timestamps: true,
})
export class Channel {
  @Prop({ required: true })
  name: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  owner: User;

  @Prop({ default: '' })
  logo: string;

  @Prop({ default: '' })
  banner: string;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Channel' })
  subscribers: Channel[];

  @Prop({
    type: [SchemaTypes.ObjectId],
    ref: 'Channel',
  })
  subscribes?: Channel[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Video' })
  videos: Video[];
}

const ChannelSchema = SchemaFactory.createForClass(Channel);

export { ChannelSchema };
