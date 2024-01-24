import { injectable, inject } from 'inversify';
import { Response, NextFunction } from 'express';
import { SERVICE_TYPES } from '@/types/services';
import { HELPER_TYPES } from '@/types/helpers';
import { HttpStatusCodeEnum } from '@/constants/HttpStatusCodeConstants';
import { ICompanyController } from '@/interfaces/controllers/ICompanyController';
import { ICompanyService } from '@/interfaces/services/ICompanyService';
import { IAsyncHandlerHelper } from '@/interfaces/helpers/IAsyncHandlerHelper';
import { IAuthRequest } from '@/interfaces/common/IAuth';
import { Company } from '@/models/Company';
import { IItemPagination } from '@/interfaces/common/IApi';

@injectable()
export class CompanyController implements ICompanyController {
  constructor(
    @inject(HELPER_TYPES.AsyncHandlerHelper) private asyncHandlerHelper: IAsyncHandlerHelper,
    @inject(SERVICE_TYPES.CompanyService) private companyService: ICompanyService,
  ) {}

  create = (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    return this.asyncHandlerHelper.handle<Company>(this.companyService.create, HttpStatusCodeEnum.CREATED)(
      req,
      res,
      next,
    );
  };

  findAll = (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    return this.asyncHandlerHelper.handle<IItemPagination<Company>>(this.companyService.findAll)(req, res, next);
  };

  findOne = (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    return this.asyncHandlerHelper.handle<Company>(this.companyService.findOne)(req, res, next);
  };

  update = (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    return this.asyncHandlerHelper.handle<Company>(this.companyService.update)(req, res, next);
  };

  delete = (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    return this.asyncHandlerHelper.handle<{ message: string }>(this.companyService.delete)(req, res, next);
  };
}
