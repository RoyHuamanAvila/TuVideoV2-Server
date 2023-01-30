import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Channel } from 'src/channel/channel.schema';

export type VideoDocument = HydratedDocument<Video>;

@Schema({ autoIndex: true, toJSON: { virtuals: true } })
export class Video {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  thumbnail: string;

  @Prop()
  views: number;

  @Prop({ required: true })
  url: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Channel', required: true })
  owner: Channel;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Comment' })
  comments: Comment[];
}

export const VideoSchema = SchemaFactory.createForClass(Video);

VideoSchema.virtual('VideoResume').get(function () {
  return `title: ${this.title}`;
});
