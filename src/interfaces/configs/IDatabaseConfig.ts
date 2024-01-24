import { Sequelize } from 'sequelize-typescript';

export interface IDatabaseConfig {
  getInstance(): Sequelize;
}
