import { NextFunction, Request, Response } from 'express';
import { HttpStatusCodeEnum } from '@/constants/HttpStatusCodeConstants';

export interface IAsyncHandlerHelper {
  handle<T>(
    fn: (req: Request) => Promise<T>,
    statusCode?: HttpStatusCodeEnum,
  ): (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
