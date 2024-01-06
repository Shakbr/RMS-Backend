import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { IRouter } from '@/interfaces/router/IRouter';
import { CONTROLLER_TYPES } from '@/types/controllers';
import { IWaybillController } from '@/interfaces/controllers/IWaybillController';
import { MIDDLEWARE_TYPES } from '@/types/middlewares';
import { IAuthMiddleware } from '@/interfaces/middlewares/IAuthMiddleware';

@injectable()
export class WaybillRouter implements IRouter {
  private router: Router;
  constructor(
    @inject(CONTROLLER_TYPES.WaybillController) private waybillController: IWaybillController,
    @inject(MIDDLEWARE_TYPES.AuthMiddleware) private authMiddleware: IAuthMiddleware,
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(this.authMiddleware.protect);

    this.router.get('/sync', this.waybillController.syncDailyWaybills);
    this.router.get('/sync-units', this.waybillController.syncWaybillUnits);
    this.router.get('/', this.waybillController.findAll);
  }

  getRouter(): Router {
    return this.router;
  }
}
