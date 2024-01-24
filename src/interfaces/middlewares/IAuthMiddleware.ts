import { NextFunction, Response } from 'express';
import { IAuthRequest } from '../common/IAuth';

export interface IAuthMiddleware {
  protect(req: IAuthRequest, res: Response, next: NextFunction): Promise<void>;
}
