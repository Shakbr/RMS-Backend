import { Product } from '@/models/Product';
import { Company } from './../../models/Company';
import { User } from '@/models/User';
import { WaybillUnit } from '@/models/WaybillUnit';
import { Sequelize } from 'sequelize-typescript';
import { Waybill } from '@/models/Waybill';
import { Cake } from '@/models/Cake';
import { CakeIngredient } from '@/models/CakeIngredient';

const isTestEnvironment = process.env.NODE_ENV === 'test';
export const defaultPort = 5432;
const sequelize = isTestEnvironment
  ? new Sequelize(null, null, null, {
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      models: [__dirname + '/../models'],
    })
  : new Sequelize(process.env.DB_DATABASE!, process.env.DB_USERNAME!, process.env.DB_PASSWORD, {
      host: process.env.DB_HOST,
      dialect: 'postgres',
      port: process.env.DB_PORT ? +process.env.DB_PORT : defaultPort,
      models: [User, Company, WaybillUnit, Product, Waybill, Cake, CakeIngredient],
    });

export default sequelize;
