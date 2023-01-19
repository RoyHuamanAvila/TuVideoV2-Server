import { Types } from 'mongoose';

export interface CreateVideo {
  title: string;
  url: string;
  description?: string;
  thumbnail: string;
  owner: Types.ObjectId;
}
