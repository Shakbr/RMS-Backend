import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { CONTROLLER_TYPES } from '@/types/controllers';
import { IRouter } from '@/interfaces/router/IRouter';
import { IUserController } from '@/interfaces/controllers/IUserController';
import { VALIDATOR_TYPES } from '@/types/validations';
import { IUserValidator } from '@/interfaces/validators/IUserValidator';
import { MIDDLEWARE_TYPES } from '@/types/middlewares';
import { IValidationErrorHandlerMiddleware } from '@/interfaces/middlewares/IValidationErrorHandlerMiddleware';

@injectable()
export class UserRouter implements IRouter {
  private router: Router;

  constructor(
    @inject(CONTROLLER_TYPES.UserController) private userController: IUserController,
    @inject(VALIDATOR_TYPES.UserValidator) private userValidator: IUserValidator,
    @inject(MIDDLEWARE_TYPES.ValidationErrorHandlerMiddleware)
    private validationErrorHandlerMiddleware: IValidationErrorHandlerMiddleware,
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      '/login',
      this.userValidator.getLoginValidation(),
      this.validationErrorHandlerMiddleware.handleError,
      this.userController.login,
    );
    this.router.post(
      '/register',
      this.userValidator.getCreationValidation(),
      this.validationErrorHandlerMiddleware.handleError,
      this.userController.register,
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
