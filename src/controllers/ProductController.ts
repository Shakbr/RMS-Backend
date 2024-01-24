import { injectable, inject } from 'inversify';
import { Response, NextFunction } from 'express';
import { SERVICE_TYPES } from '@/types/services';
import { HELPER_TYPES } from '@/types/helpers';
import { HttpStatusCodeEnum } from '@/constants/HttpStatusCodeConstants';
import { IProductController } from '@/interfaces/controllers/IProductController';
import { IProductService } from '@/interfaces/services/IProductService';
import { IAsyncHandlerHelper } from '@/interfaces/helpers/IAsyncHandlerHelper';
import { IAuthRequest } from '@/interfaces/common/IAuth';
import { Product } from '@/models/Product';
import { IItemPagination } from '@/interfaces/common/IApi';

@injectable()
export class ProductController implements IProductController {
  constructor(
    @inject(HELPER_TYPES.AsyncHandlerHelper) private asyncHandlerHelper: IAsyncHandlerHelper,
    @inject(SERVICE_TYPES.ProductService) private productService: IProductService,
  ) {}

  create = (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    return this.asyncHandlerHelper.handle<Product>(this.productService.create, HttpStatusCodeEnum.CREATED)(
      req,
      res,
      next,
    );
  };

  findAll = (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    return this.asyncHandlerHelper.handle<IItemPagination<Product>>(this.productService.findAll)(req, res, next);
  };

  findOne = (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    return this.asyncHandlerHelper.handle<Product>(this.productService.findOne)(req, res, next);
  };

  update = (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    return this.asyncHandlerHelper.handle<Product>(this.productService.update)(req, res, next);
  };

  delete = (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    return this.asyncHandlerHelper.handle<{ message: string }>(this.productService.delete)(req, res, next);
  };
}
