import { Application } from 'express';

export interface IExpressConfig {
  getApp(): Application;
}
