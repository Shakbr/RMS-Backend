import { UserDTO } from '@/models/User';
import { Request } from 'express';
import { IAuthenticateUser } from '../common/IAuth';

export interface IUserService {
  register(req: Request): Promise<UserDTO>;
  login(req: Request): Promise<IAuthenticateUser>;
}
