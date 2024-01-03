import { injectable } from 'inversify';
import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ApiError } from '../errors/ApiError';
import { UserDTO } from '@/models/User';
import { IAuthMiddleware } from '@/interfaces/middlewares/IAuthMiddleware';
import { IAuthRequest } from '@/interfaces/common/IAuth';
import { AuthUtils } from '@/utils/AuthUtils';

@injectable()
export class AuthMiddleware implements IAuthMiddleware {
  async protect(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        throw ApiError.badRequest('No token provided');
      }

      const decoded = jwt.verify(token, AuthUtils.getJWTSecret()) as JwtPayload;
      const { id, name, email, role } = decoded.user;

      const user: UserDTO = { id, name, email, role };
      req.user = user;
      next();
    } catch (error) {
      next(ApiError.unauthorized('Not authorized'));
    }
  }
}
