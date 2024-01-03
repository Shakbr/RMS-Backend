import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { ROUTE_TYPES } from '@/types/routes';
import { UserRouter } from './UserRouter';
import { IRouter } from '@/interfaces/router/IRouter';
// import companyRoutes from './companyRoutes';
// import waybillRoutes from './waybillRoutes';
// import productRoutes from './productRoutes';

@injectable()
export class MainRouter implements IRouter {
  private router: Router;

  constructor(@inject(ROUTE_TYPES.UserRouter) private userRoutes: UserRouter) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use('/auth', this.userRoutes.getRouter());
    // this.router.use('/companies', companyRoutes);
    // this.router.use('/waybills', waybillRoutes);
    // this.router.use('/products', productRoutes);
  }

  public getRouter(): Router {
    return this.router;
  }
}
