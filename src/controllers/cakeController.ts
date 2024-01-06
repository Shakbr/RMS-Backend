import { Response, NextFunction } from 'express';
import { HttpStatusCodeEnum } from '@/constants/HttpStatusCodeConstants';
import { IAsyncHandlerHelper } from '@/interfaces/helpers/IAsyncHandlerHelper';
import { ICakeService } from '@/interfaces/services/ICakeService';
import { Cake } from '@/models/Cake';
import { HELPER_TYPES } from '@/types/helpers';
import { SERVICE_TYPES } from '@/types/services';
import { inject, injectable } from 'inversify';
import { IAuthRequest } from '@/interfaces/common/IAuth';
import { ICakeController } from '@/interfaces/controllers/ICakeController';
import { IItemPagination } from '@/interfaces/common/IApi';

@injectable()
export class CakeController implements ICakeController {
  constructor(
    @inject(HELPER_TYPES.AsyncHandlerHelper) private asyncHandlerHelper: IAsyncHandlerHelper,
    @inject(SERVICE_TYPES.CakeService) private cakeService: ICakeService,
  ) {}
  create = (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    return this.asyncHandlerHelper.handle<Cake>(this.cakeService.create, HttpStatusCodeEnum.CREATED)(req, res, next);
  };

  findAll = (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    return this.asyncHandlerHelper.handle<IItemPagination<Cake>>(this.cakeService.findAll)(req, res, next);
  };
}
