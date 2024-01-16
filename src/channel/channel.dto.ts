import mongoose from 'mongoose';

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
