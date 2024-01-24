import { Container } from 'inversify';

// Types
import { CONTROLLER_TYPES } from '@/types/controllers';
import { CONFIG_TYPES } from '@/types/config';
import { ROUTE_TYPES } from '@/types/routes';
import { UserRouter } from '@/routes/UserRouter';
import { SERVICE_TYPES } from '@/types/services';
import { HELPER_TYPES } from '@/types/helpers';
import { MIDDLEWARE_TYPES } from '@/types/middlewares';
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
import { IDatabaseConfig } from '@/interfaces/configs/IDatabaseConfig';
import { ICompanyService } from '@/interfaces/services/ICompanyService';
import { ICompanyController } from '@/interfaces/controllers/ICompanyController';
import { IWaybillHelper } from '@/interfaces/helpers/IWaybillHelper';
import { IProductService } from '@/interfaces/services/IProductService';
import { ISoapService } from '@/interfaces/services/ISoapService';
import { IWaybillService } from '@/interfaces/services/IWaybillService';
import { IWaybillController } from '@/interfaces/controllers/IWaybillController';
import { IProductController } from '@/interfaces/controllers/IProductController';
import { ICakeController } from '@/interfaces/controllers/ICakeController';
import { ICakeService } from '@/interfaces/services/ICakeService';
import { IAuthHelper } from '@/interfaces/helpers/IAuthHelper';

// Implementations
import { UserController } from '@/controllers/UserController';
import { UserService } from '@/services/UserService';
import { AsyncHandlerHelper } from '@/helpers/AsyncHandlerHelper';
import { AuthMiddleware } from '@/middlewares/AuthMiddleware';
import { ErrorHandlerMIddleware } from '@/middlewares/ErrorHandlerMiddleware';
import { MainRouter } from '@/routes/MainRouter';
import { DatabaseConfig } from '@/configs/DatabaseConfig';
import { DatabaseInitializer } from '@/database/DatabaseInitializer';
import { ExpressConfig } from '@/configs/ExpressConfig';
import { UserValidator } from '@/validators/UserValidator';
import { ValidationErrorHandlerMiddleware } from '@/middlewares/ValidationErrorHandlerMiddleware';
import { DatabaseHelper } from '@/helpers/DatabaseHelper';
import { CompanyService } from '@/services/CompanyService';
import { CompanyController } from '@/controllers/CompanyController';
import { CompanyRouter } from '@/routes/CompanyRouter';
import { ProductService } from '@/services/ProductService';
import { WaybillHelper } from '@/helpers/WaybillHelper';
import { SoapService } from '@/services/SoapService';
import { ISoapHelper } from '@/interfaces/helpers/ISoapHelper';
import { SoapHelper } from '@/helpers/SoapHelper';
import { WaybillService } from '@/services/WaybillService';
import { WaybillRouter } from '@/routes/WaybillRouter';
import { WaybillController } from '@/controllers/WaybillController';
import { ProductController } from '@/controllers/ProductController';
import { CakeController } from '@/controllers/CakeController';
import { CakeRouter } from '@/routes/CakeRouter';
import { CakeService } from '@/services/CakeService';
import { ProductRouter } from '@/routes/ProductRouter';
import { AuthHelper } from '@/helpers/AuthHelper';

const container = new Container();

// Configs
container.bind<IExpressConfig>(CONFIG_TYPES.ExpressConfig).to(ExpressConfig);
container.bind<IDatabaseConfig>(CONFIG_TYPES.DatabaseConfig).to(DatabaseConfig);

// Database
container.bind<IDatabaseInitializer>(DATABASE_TYPES.DatabaseInitializer).to(DatabaseInitializer);

// Routes
container.bind<IRouter>(ROUTE_TYPES.MainRouter).to(MainRouter);
container.bind<IRouter>(ROUTE_TYPES.UserRouter).to(UserRouter);
container.bind<IRouter>(ROUTE_TYPES.CompanyRouter).to(CompanyRouter);
container.bind<IRouter>(ROUTE_TYPES.ProductRouter).to(ProductRouter);
container.bind<IRouter>(ROUTE_TYPES.WaybillRouter).to(WaybillRouter);
container.bind<IRouter>(ROUTE_TYPES.CakeRouter).to(CakeRouter);

// Controllers
container.bind<IUserController>(CONTROLLER_TYPES.UserController).to(UserController);
container.bind<ICompanyController>(CONTROLLER_TYPES.CompanyController).to(CompanyController);
container.bind<IProductController>(CONTROLLER_TYPES.ProductController).to(ProductController);
container.bind<IWaybillController>(CONTROLLER_TYPES.WaybillController).to(WaybillController);
container.bind<ICakeController>(CONTROLLER_TYPES.CakeController).to(CakeController);

// Services
container.bind<IUserService>(SERVICE_TYPES.UserService).to(UserService);
container.bind<ICompanyService>(SERVICE_TYPES.CompanyService).to(CompanyService);
container.bind<IProductService>(SERVICE_TYPES.ProductService).to(ProductService);
container.bind<IWaybillService>(SERVICE_TYPES.WaybillService).to(WaybillService);
container.bind<ISoapService>(SERVICE_TYPES.SoapService).to(SoapService);
container.bind<ICakeService>(SERVICE_TYPES.CakeService).to(CakeService);

// Middlewares
container.bind<IAuthMiddleware>(MIDDLEWARE_TYPES.AuthMiddleware).to(AuthMiddleware);
container.bind<IErrorHandlerMiddleware>(MIDDLEWARE_TYPES.ErrorHandlerMiddleware).to(ErrorHandlerMIddleware);
container
  .bind<IValidationErrorHandlerMiddleware>(MIDDLEWARE_TYPES.ValidationErrorHandlerMiddleware)
  .to(ValidationErrorHandlerMiddleware);

// Helpers
container.bind<IAsyncHandlerHelper>(HELPER_TYPES.AsyncHandlerHelper).to(AsyncHandlerHelper);
container.bind<IDatabaseHelper>(HELPER_TYPES.DatabaseHelper).to(DatabaseHelper);
container.bind<IWaybillHelper>(HELPER_TYPES.WaybillHelper).to(WaybillHelper);
container.bind<ISoapHelper>(HELPER_TYPES.SoapHelper).to(SoapHelper);
container.bind<IAuthHelper>(HELPER_TYPES.AuthHelper).to(AuthHelper);

// Validators
container.bind<IUserValidator>(VALIDATOR_TYPES.UserValidator).to(UserValidator);

export { container };
