import { ICakeController } from '@/interfaces/controllers/ICakeController';
import { IAuthMiddleware } from '@/interfaces/middlewares/IAuthMiddleware';
import { IRouter } from '@/interfaces/router/IRouter';
import { CONTROLLER_TYPES } from '@/types/controllers';
import { MIDDLEWARE_TYPES } from '@/types/middlewares';
import { Router } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class CakeRouter implements IRouter {
  private router: Router;
  constructor(
    @inject(CONTROLLER_TYPES.CakeController) private cakeController: ICakeController,
    @inject(MIDDLEWARE_TYPES.AuthMiddleware) private authMiddleware: IAuthMiddleware,
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(this.authMiddleware.protect);
    this.router.post('/', this.cakeController.create);
    this.router.get('/', this.cakeController.findAll);
  }

  getRouter(): Router {
    return this.router;
  }
}
