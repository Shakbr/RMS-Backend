// DatabaseInitializer.ts
import { injectable, inject } from 'inversify';
import { CONFIG_TYPES } from '@/types/config';
import { DatabaseConfig } from '@/configs/DatabaseConfig';
import { IDatabaseInitializer } from '@/interfaces/database/IDatabaseInitializer';

@injectable()
export class DatabaseInitializer implements IDatabaseInitializer {
  constructor(@inject(CONFIG_TYPES.DatabaseConfig) private databaseConfig: DatabaseConfig) {}

  async initialize(): Promise<void> {
    try {
      const sequelize = this.databaseConfig.getInstance();
      await sequelize.authenticate();
      console.log('Connection to the database has been established successfully.');
      // await sequelize.sync({ force: false });
      console.log('Database & tables created!');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      process.exit(1);
    }
  }
}
