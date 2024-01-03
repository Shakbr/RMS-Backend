import { Sequelize } from 'sequelize-typescript';
import { injectable } from 'inversify';
import { User } from '@/models/User';
import { Company } from '@/models/Company';
import { Product } from '@/models/Product';
import { WaybillUnit } from '@/models/WaybillUnit';
import { Waybill } from '@/models/Waybill';
import { Cake } from '@/models/Cake';
import { CakeIngredient } from '@/models/CakeIngredient';

@injectable()
export class DatabaseConfig {
  private sequelize: Sequelize;
  private readonly defaultPort = 5432;
  private isTestEnvironment = process.env.NODE_ENV === 'test';

  constructor() {
    this.initialize();
  }

  private initialize() {
    this.sequelize = this.isTestEnvironment
      ? new Sequelize(null, null, null, {
          dialect: 'sqlite',
          storage: ':memory:',
          logging: false,
          models: [__dirname + '/../models'],
        })
      : new Sequelize(process.env.DB_DATABASE!, process.env.DB_USERNAME!, process.env.DB_PASSWORD, {
          host: process.env.DB_HOST,
          dialect: 'postgres',
          port: process.env.DB_PORT ? +process.env.DB_PORT : this.defaultPort,
          models: [User, Company, WaybillUnit, Product, Waybill, Cake, CakeIngredient],
        });
  }

  public getInstance() {
    return this.sequelize;
  }
}
