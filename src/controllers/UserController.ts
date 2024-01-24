import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { SERVICE_TYPES } from '@/types/services';
import { HELPER_TYPES } from '@/types/helpers';
import { HttpStatusCodeEnum } from '@/constants/HttpStatusCodeConstants';
import { IUserController } from '@/interfaces/controllers/IUserController';
import { IUserService } from '@/interfaces/services/IUserService';
import { IAsyncHandlerHelper } from '@/interfaces/helpers/IAsyncHandlerHelper';
import { UserDTO } from '@/models/User';

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject(HELPER_TYPES.AsyncHandlerHelper) private asyncHandlerHelper: IAsyncHandlerHelper,
    @inject(SERVICE_TYPES.UserService) private userService: IUserService,
  ) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user, accessToken, refreshToken } = await this.userService.login(req);
      res.cookie('refreshToken', refreshToken, { httpOnly: true });
      res.status(HttpStatusCodeEnum.OK).json({ user, accessToken });
    } catch (error) {
      next(error);
    }
  };

  register = (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return this.asyncHandlerHelper.handle<UserDTO>(this.userService.register, HttpStatusCodeEnum.CREATED)(
      req,
      res,
      next,
    );
  };

  regenerateAccessAndRefreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { accessToken, refreshToken } = await this.userService.regenerateAccessAndRefreshToken(req);
      res.cookie('refreshToken', refreshToken, { httpOnly: true });
      res.status(HttpStatusCodeEnum.OK).json({ accessToken });
    } catch (error) {
      next(error);
    }
  };
}
