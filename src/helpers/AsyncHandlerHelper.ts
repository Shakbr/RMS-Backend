import { injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { HttpStatusCodeEnum } from '@/constants/HttpStatusCodeConstants';
import { IAsyncHandlerHelper } from '@/interfaces/helpers/IAsyncHandlerHelper';

@injectable()
export class AsyncHandlerHelper implements IAsyncHandlerHelper {
  handle<T>(fn: (req: Request) => Promise<T>, status: HttpStatusCodeEnum = HttpStatusCodeEnum.OK) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const result = await fn(req);
        res.status(status).json(result);
      } catch (error) {
        next(error);
      }
    };
  }
}
