import * as dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';
import { CONFIG_TYPES } from './types/config';
import { container } from '@/configs/inversify.config';
import { IDatabaseInitializer } from './interfaces/database/IDatabaseInitializer';
import { IExpressConfig } from './interfaces/configs/IExpressConfig';
import { DATABASE_TYPES } from './types/database';

const startServer = async (): Promise<void> => {
  try {
    const expressConfig = container.get<IExpressConfig>(CONFIG_TYPES.ExpressConfig);
    const databaseInitializer = container.get<IDatabaseInitializer>(DATABASE_TYPES.DatabaseInitializer);
    const app = expressConfig.getApp();
    await databaseInitializer.initialize();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));
  } catch (error) {
    console.error('Error starting the server', error);
    process.exit(1);
  }
};

void startServer();
