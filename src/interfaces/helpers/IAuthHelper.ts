import { UserDTO } from '@/models/User';
import { Transaction } from 'sequelize';

export interface IAuthHelper {
  generateAccessToken(userDTO: UserDTO): string;
  generateRefreshToken(userDTO: UserDTO, transaction?: Transaction): Promise<string>;
  verifyAccessToken(accessToken: string): UserDTO;
  verifyRefreshToken(refreshToken: string): UserDTO;
}
