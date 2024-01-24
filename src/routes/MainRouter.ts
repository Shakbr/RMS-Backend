import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { ROUTE_TYPES } from '@/types/routes';
import { IRouter } from '@/interfaces/router/IRouter';

@injectable()
export class MainRouter implements IRouter {
  private router: Router;

  constructor(
    @inject(ROUTE_TYPES.UserRouter) private userRoutes: IRouter,
    @inject(ROUTE_TYPES.CompanyRouter) private companyRouter: IRouter,
    @inject(ROUTE_TYPES.ProductRouter) private productRouter: IRouter,
    @inject(ROUTE_TYPES.WaybillRouter) private waybillRouter: IRouter,
    @inject(ROUTE_TYPES.CakeRouter) private cakeRouter: IRouter,
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use('/auth', this.userRoutes.getRouter());
    this.router.use('/companies', this.companyRouter.getRouter());
    this.router.use('/products', this.productRouter.getRouter());
    this.router.use('/waybills', this.waybillRouter.getRouter());
    this.router.use('/cakes', this.cakeRouter.getRouter());
  }

  public getRouter(): Router {
    return this.router;
  }
}
