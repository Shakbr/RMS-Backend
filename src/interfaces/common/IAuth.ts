import { Request } from 'express';
import { UserDTO } from '@/models/User';

export interface IAuthenticateUser {
  user: UserDTO;
  token: string;
}

export interface IAuthRequest extends Request {
  user?: UserDTO;
}
