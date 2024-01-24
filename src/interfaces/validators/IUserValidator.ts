import { ValidationChain } from 'express-validator';

export interface IUserValidator {
  getCreationValidation(): ValidationChain[];
  getLoginValidation(): ValidationChain[];
}
