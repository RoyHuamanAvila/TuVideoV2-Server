import { Types } from 'mongoose';

export interface CreateUser {
  name: string;
  email: string;
}

export interface UpdateUser {
  name?: string;
  email?: string;
  channel?: Types.ObjectId;
}
