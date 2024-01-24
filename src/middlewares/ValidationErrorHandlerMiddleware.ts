import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { HttpStatusCodeEnum } from '@/constants/HttpStatusCodeConstants';
import { IValidationErrorHandlerMiddleware } from '@/interfaces/middlewares/IValidationErrorHandlerMiddleware';
import { injectable } from 'inversify';

@injectable()
export class ValidationErrorHandlerMiddleware implements IValidationErrorHandlerMiddleware {
  handleError(req: Request, res: Response, next: NextFunction): void | Response {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(HttpStatusCodeEnum.BAD_REQUEST).json({ errors: errors.array() });
    }
    next();
  }
}
