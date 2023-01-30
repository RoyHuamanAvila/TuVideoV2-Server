import { Types } from 'mongoose';

export interface CreateComment {
  owner: Types.ObjectId;
  videoID: Types.ObjectId;
  content: string;
}
