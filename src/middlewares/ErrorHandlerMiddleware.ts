import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../errors/ApiError';
import { ValidationError } from 'sequelize';
import { HttpStatusCodeEnum } from '@/constants/HttpStatusCodeConstants';
import { injectable } from 'inversify';
import { IErrorHandlerMiddleware } from '@/interfaces/middlewares/IErrorHandlerMIddleware';

@injectable()
export class ErrorHandlerMIddleware implements IErrorHandlerMiddleware {
  handleError(err: Error, req: Request, res: Response, _next: NextFunction): void {
    let statusCode = HttpStatusCodeEnum.INTERNAL_SERVER_ERROR;
    let message: string | object = `Internal Server Error: ${err}`;

    if (err instanceof ApiError) {
      statusCode = err.status;
      message = err.message;
    } else if (err instanceof ValidationError) {
      statusCode = HttpStatusCodeEnum.BAD_REQUEST;
      message = err.errors.reduce((acc, currentError) => {
        acc[currentError.path] = currentError.message;
        return acc;
      }, {});
    }

    res.status(statusCode).json({ error: message });
  }
}
