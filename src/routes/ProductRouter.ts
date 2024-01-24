import { IProductController } from '@/interfaces/controllers/IProductController';
import { IAuthMiddleware } from '@/interfaces/middlewares/IAuthMiddleware';
import { IRouter } from '@/interfaces/router/IRouter';
import { CONTROLLER_TYPES } from '@/types/controllers';
import { MIDDLEWARE_TYPES } from '@/types/middlewares';
import { Router } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class ProductRouter implements IRouter {
  private router: Router;
  constructor(
    @inject(CONTROLLER_TYPES.ProductController) private productController: IProductController,
    @inject(MIDDLEWARE_TYPES.AuthMiddleware) private authMiddleware: IAuthMiddleware,
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(this.authMiddleware.protect);

    this.router.get('/', this.productController.findAll);
    this.router.get('/:id', this.productController.findOne);
    this.router.post('/', this.productController.create);
    this.router.patch('/:id', this.productController.update);
    this.router.delete('/:id', this.productController.delete);
  }

  getRouter(): Router {
    return this.router;
  }
}
