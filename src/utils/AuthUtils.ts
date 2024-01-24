import { UserDTO } from '@/models/User';
import { Secret } from 'jsonwebtoken';
import { Role } from '../models/User';

export class AuthUtils {
  static isAdmin(user: UserDTO): boolean {
    return user.role === Role.ADMIN;
  }

  static getAccessTokenSecret(): Secret {
    return process.env.ACCESS_TOKEN_SECRET;
  }

  static getRefreshTokenSecret(): Secret {
    return process.env.REFRESH_TOKEN_SECRET;
  }

  static getAccessTokenExpiration(): string {
    return process.env.ACCESS_TOKEN_EXPIRES_IN;
  }

  static getRefreshTokenExpiration(): string {
    return process.env.REFRESH_TOKEN_EXPIRES_IN;
  }
}
