import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { SERVICE_TYPES } from '@/types/services';
import { HELPER_TYPES } from '@/types/helpers';
import { HttpStatusCodeEnum } from '@/constants/HttpStatusCodeConstants';
import { IUserController } from '@/interfaces/controllers/IUserController';
import { IUserService } from '@/interfaces/services/IUserService';
import { IAsyncHandlerHelper } from '@/interfaces/helpers/IAsyncHandlerHelper';
import { UserDTO } from '@/models/User';
import { IAuthenticateUser } from '@/interfaces/common/IAuth';

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject(HELPER_TYPES.AsyncHandlerHelper) private asyncHandlerHelper: IAsyncHandlerHelper,
    @inject(SERVICE_TYPES.UserService) private userService: IUserService,
  ) {}

  login = (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return this.asyncHandlerHelper.handle<IAuthenticateUser>(this.userService.login, HttpStatusCodeEnum.OK)(
      req,
      res,
      next,
    );
  };

  register = (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return this.asyncHandlerHelper.handle<UserDTO>(this.userService.register, HttpStatusCodeEnum.CREATED)(
      req,
      res,
      next,
    );
  };
}
