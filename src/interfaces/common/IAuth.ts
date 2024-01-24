import { Request } from 'express';
import { UserDTO } from '@/models/User';
import { JwtPayload } from 'jsonwebtoken';

export interface IAuthenticateUser {
  user: UserDTO;
  accessToken: string;
  refreshToken?: string;
}

export interface IAuthRequest extends Request {
  user?: UserDTO;
}

export interface IUserJWT extends JwtPayload {
  user: UserDTO;
}
