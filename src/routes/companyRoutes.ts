import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { IRouter } from '@/interfaces/router/IRouter';
import { MIDDLEWARE_TYPES } from '@/types/middlewares';
import { IAuthMiddleware } from '@/interfaces/middlewares/IAuthMiddleware';
import { CONTROLLER_TYPES } from '@/types/controllers';
import { ICompanyController } from '@/interfaces/controllers/ICompanyController';

@injectable()
export class CompanyRouter implements IRouter {
  private router: Router;

  constructor(
    @inject(CONTROLLER_TYPES.CompanyController) private companyController: ICompanyController,
    @inject(MIDDLEWARE_TYPES.AuthMiddleware) private authMiddleware: IAuthMiddleware,
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(this.authMiddleware.protect);

    this.router.get('/', this.companyController.findAll);
    this.router.get('/:id', this.companyController.findOne);
    this.router.post('/', this.companyController.create);
    this.router.put('/:id', this.companyController.update);
    this.router.delete('/:id', this.companyController.delete);
  }

  public getRouter(): Router {
    return this.router;
  }
}
