import { NextFunction, Request, Response } from 'express';

export interface IUserController {
  login(req: Request, res: Response, next: NextFunction): Promise<void>;
  register(req: Request, res: Response, next: NextFunction): Promise<void>;
  regenerateAccessAndRefreshToken(req: Request, res: Response, next: NextFunction): Promise<void>;
}
