import { Request } from 'express';

export interface CustomRequest extends Request {
  token: string;
  auth0ID: string;
  userInfo: UserData;
}

export interface UserData {
  created_at: Date;
  email: string;
  identities: Identity[];
  name: string;
  nickname: string;
  picture: string;
  updated_at: Date;
  user_id: string;
  user_metadata: UserMetadata;
  last_ip: string;
  last_login: Date;
  logins_count: number;
}

export interface Identity {
  connection: string;
  provider: string;
  user_id: string;
  isSocial: boolean;
}

export interface UserMetadata {
  channel: string;
}
