import mongoose, { Types } from 'mongoose';
import { Video } from 'src/video/video.schema';

export interface CreateChannel {
  owner?: mongoose.Types.ObjectId;
  name: string;
  logo: string;
}

export interface UpdateChannel {
  name?: string;
  logo?: string;
  banner?: string;
  videos?: mongoose.Types.ObjectId[];
}
