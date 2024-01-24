import { NextFunction, Request, Response } from 'express';

export interface IValidationErrorHandlerMiddleware {
  handleError(req: Request, res: Response, next: NextFunction): void | Response;
}
