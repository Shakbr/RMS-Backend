import { UserDTO } from '@/models/User';
import jwt, { Secret } from 'jsonwebtoken';
import { Role } from '../models/User';

export class AuthUtils {
  static isAdmin(user: UserDTO): boolean {
    return user.role === Role.ADMIN;
  }

  static generateToken(userDTO: UserDTO): string {
    return jwt.sign({ user: userDTO }, this.getJWTSecret(), { expiresIn: '1h' });
  }

  static getJWTSecret(): Secret {
    return process.env.JWT_SECRET;
  }
}
