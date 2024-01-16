import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { User } from '../user/user.schema';
import { Video } from '../video/video.schema';

export type ChannelDocument = HydratedDocument<Channel>;

@Schema({
  autoIndex: true,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
export class Channel {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

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

ChannelSchema.virtual('ChannelResume').get(function () {
  return {
    _id: this._id,
    logo: this.logo,
    name: this.name,
    subscribers: this.subscribers,
  };
});

export { ChannelSchema };
