import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { injectable, inject } from 'inversify';
import { ErrorHandlerMIddleware } from '@/middlewares/ErrorHandlerMiddleware';
import cors from 'cors';
import { ROUTE_TYPES } from '@/types/routes';
import { ValidateEnvUtils } from '@/utils/ValidateEnvUtils';
import { MIDDLEWARE_TYPES } from '@/types/middlewares';
import { IExpressConfig } from '@/interfaces/configs/IExpressConfig';
import { IRouter } from '@/interfaces/router/IRouter';

@injectable()
export class ExpressConfig implements IExpressConfig {
  private app: Application;

  constructor(
    @inject(ROUTE_TYPES.MainRouter) private mainRouter: IRouter,
    @inject(MIDDLEWARE_TYPES.ErrorHandlerMiddleware) private errorHandlerMiddleware: ErrorHandlerMIddleware,
  ) {
    ValidateEnvUtils.validateEnv();
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares() {
    this.app.use(
      cors({
        origin: 'http://localhost:5173',
        credentials: true,
      }),
    );
    this.app.use(compression());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());

    this.app.use(helmet());
    this.app.use(cookieParser());
    this.app.use(morgan('dev'));
  }

  private initializeRoutes() {
    this.app.use('/api', this.mainRouter.getRouter());

    // error middleware
    this.app.use(this.errorHandlerMiddleware.handleError);
  }

  public getApp(): Application {
    return this.app;
  }
}
