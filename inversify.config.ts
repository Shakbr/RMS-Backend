import { Container } from 'inversify';

// Types
import { CONTROLLER_TYPES } from './src/types/controllers';
import { CONFIG_TYPES } from './src/types/config';
import { ROUTE_TYPES } from './src/types/routes';
import { UserRouter } from './src/routes/UserRouter';
import { SERVICE_TYPES } from './src/types/services';
import { HELPER_TYPES } from './src/types/helpers';
import { MIDDLEWARE_TYPES } from './src/types/middlewares';
import { DATABASE_TYPES } from '@/types/database';
import { VALIDATOR_TYPES } from '@/types/validations';

// Interfaces
import { IRouter } from '@/interfaces/router/IRouter';
import { IUserController } from '@/interfaces/controllers/IUserController';
import { IUserService } from '@/interfaces/services/IUserService';
import { IAsyncHandlerHelper } from '@/interfaces/helpers/IAsyncHandlerHelper';
import { IDatabaseInitializer } from '@/interfaces/database/IDatabaseInitializer';
import { IExpressConfig } from '@/interfaces/configs/IExpressConfig';
import { IAuthMiddleware } from '@/interfaces/middlewares/IAuthMiddleware';
import { IErrorHandlerMiddleware } from '@/interfaces/middlewares/IErrorHandlerMIddleware';
import { IUserValidator } from '@/interfaces/validators/IUserValidator';
import { IValidationErrorHandlerMiddleware } from '@/interfaces/middlewares/IValidationErrorHandlerMiddleware';
import { IDatabaseHelper } from '@/interfaces/helpers/IDatabaseHelper';
import { ICompanyService } from '@/interfaces/services/ICompanyService';
import { ICompanyController } from '@/interfaces/controllers/ICompanyController';

// Implementations
import { UserController } from './src/controllers/UserController';
import { UserService } from './src/services/UserService';
import { AsyncHandlerHelper } from './src/helpers/AsyncHandlerHelper';
import { AuthMiddleware } from './src/middlewares/AuthMiddleware';
import { ErrorHandlerMIddleware } from '@/middlewares/ErrorHandlerMiddleware';
import { MainRouter } from '@/routes/MainRouter';
import { DatabaseConfig } from '@/configs/DatabaseConfig';
import { DatabaseInitializer } from '@/database/DatabaseInitializer';
import { ExpressConfig } from './src/configs/ExpressConfig';
import { UserValidator } from '@/validators/UserValidator';
import { ValidationErrorHandlerMiddleware } from '@/middlewares/ValidationErrorHandlerMiddleware';
import { DatabaseHelper } from '@/helpers/DatabaseHelper';
import { CompanyService } from '@/services/CompanyService';
import { CompanyController } from '@/controllers/companyController';
import { CompanyRouter } from '@/routes/CompanyRoutes';

const container = new Container();

// Configs
container.bind<IExpressConfig>(CONFIG_TYPES.ExpressConfig).to(ExpressConfig);
container.bind<DatabaseConfig>(CONFIG_TYPES.DatabaseConfig).to(DatabaseConfig);

// Database
container.bind<IDatabaseInitializer>(DATABASE_TYPES.DatabaseInitializer).to(DatabaseInitializer);

// Routes
container.bind<IRouter>(ROUTE_TYPES.MainRouter).to(MainRouter);
container.bind<IRouter>(ROUTE_TYPES.UserRouter).to(UserRouter);
container.bind<IRouter>(ROUTE_TYPES.CompanyRouter).to(CompanyRouter);

// Controllers
container.bind<IUserController>(CONTROLLER_TYPES.UserController).to(UserController);
container.bind<ICompanyController>(CONTROLLER_TYPES.CompanyController).to(CompanyController);

// Services
container.bind<IUserService>(SERVICE_TYPES.UserService).to(UserService);
container.bind<ICompanyService>(SERVICE_TYPES.CompanyService).to(CompanyService);

// Middlewares
container.bind<IAuthMiddleware>(MIDDLEWARE_TYPES.AuthMiddleware).to(AuthMiddleware);
container.bind<IErrorHandlerMiddleware>(MIDDLEWARE_TYPES.ErrorHandlerMiddleware).to(ErrorHandlerMIddleware);
container
  .bind<IValidationErrorHandlerMiddleware>(MIDDLEWARE_TYPES.ValidationErrorHandlerMiddleware)
  .to(ValidationErrorHandlerMiddleware);

// Helpers
container.bind<IAsyncHandlerHelper>(HELPER_TYPES.AsyncHandlerHelper).to(AsyncHandlerHelper);
container.bind<IDatabaseHelper>(HELPER_TYPES.DatabaseHelper).to(DatabaseHelper);

// Validators
container.bind<IUserValidator>(VALIDATOR_TYPES.UserValidator).to(UserValidator);

export { container };
