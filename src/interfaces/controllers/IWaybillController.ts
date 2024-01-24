import { NextFunction, Response } from 'express';
import { IAuthRequest } from '../common/IAuth';

export interface IWaybillController {
  syncDailyWaybills(req: IAuthRequest, res: Response, next: NextFunction): Promise<void>;
  syncWaybillUnits(req: IAuthRequest, res: Response, next: NextFunction): Promise<void>;
  findAll(req: IAuthRequest, res: Response, next: NextFunction): Promise<void>;
}
