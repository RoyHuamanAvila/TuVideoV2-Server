import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { User } from 'src/user/user.schema';
import { Video } from 'src/video/video.schema';

export type ChannelDocument = HydratedDocument<Channel>;

@Schema({
  autoIndex: true,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
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

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  subscribers: User[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Video' })
  videos: Video[];
}

const ChannelSchema = SchemaFactory.createForClass(Channel);

ChannelSchema.virtual('ChannelResume').get(function () {
  return {
    logo: this.logo,
    name: this.name,
  };
});

export { ChannelSchema };
