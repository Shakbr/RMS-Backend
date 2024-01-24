import { inject, injectable } from 'inversify';
import { Response, NextFunction } from 'express';
import { ApiError } from '../errors/ApiError';
import { IAuthMiddleware } from '@/interfaces/middlewares/IAuthMiddleware';
import { IAuthRequest } from '@/interfaces/common/IAuth';
import { HELPER_TYPES } from '@/types/helpers';
import { IAuthHelper } from '@/interfaces/helpers/IAuthHelper';

@injectable()
export class AuthMiddleware implements IAuthMiddleware {
  @inject(HELPER_TYPES.AuthHelper) private authHelper: IAuthHelper;
  protect = async (req: IAuthRequest, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const accessToken = req.header('Authorization')?.replace('Bearer ', '');
      if (!accessToken) {
        throw ApiError.badRequest('No token provided');
      }
      const userFromDecodedAccessToken = this.authHelper.verifyAccessToken(accessToken);
      req.user = userFromDecodedAccessToken;
      next();
    } catch (error) {
      next(error);
    }
  };
}
