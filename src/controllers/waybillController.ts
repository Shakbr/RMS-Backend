import { IAuthRequest } from '@/interfaces/common/IAuth';
import { IWaybillController } from '@/interfaces/controllers/IWaybillController';
import { IAsyncHandlerHelper } from '@/interfaces/helpers/IAsyncHandlerHelper';
import { IWaybillService } from '@/interfaces/services/IWaybillService';
import { HELPER_TYPES } from '@/types/helpers';
import { SERVICE_TYPES } from '@/types/services';
import { NextFunction, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class WaybillController implements IWaybillController {
  constructor(
    @inject(HELPER_TYPES.AsyncHandlerHelper) private asyncHandlerHelper: IAsyncHandlerHelper,
    @inject(SERVICE_TYPES.WaybillService) private waybillService: IWaybillService,
  ) {}

  syncDailyWaybills = (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    return this.asyncHandlerHelper.handle(this.waybillService.syncDailyWaybills)(req, res, next);
  };

  syncWaybillUnits = (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    return this.asyncHandlerHelper.handle(this.waybillService.syncWaybillUnits)(req, res, next);
  };

  findAll = (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    return this.asyncHandlerHelper.handle(this.waybillService.findAll)(req, res, next);
  };
}
