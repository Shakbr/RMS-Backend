import { Response, NextFunction } from 'express';
import { IAuthRequest } from '../common/IAuth';

export interface ICakeController {
  create: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
  findAll: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
  findOne: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
  update: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
  delete: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
