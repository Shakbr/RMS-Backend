import { injectable } from 'inversify';
import { body, ValidationChain } from 'express-validator';
import { IUserValidator } from '@/interfaces/validators/IUserValidator';

@injectable()
export class UserValidator implements IUserValidator {
  public getCreationValidation(): ValidationChain[] {
    return [
      body('name').trim().notEmpty().withMessage('Name is required'),
      body('email').isEmail().withMessage('Invalid email address'),
      body('password').notEmpty().withMessage('Password is required'),
    ];
  }

  public getLoginValidation(): ValidationChain[] {
    return [
      body('email').isEmail().withMessage('Invalid email address'),
      body('password').notEmpty().withMessage('Password is required'),
    ];
  }
}
