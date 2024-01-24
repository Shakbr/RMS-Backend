import { ApiError } from '@/errors/ApiError';
import { IUserJWT } from '@/interfaces/common/IAuth';
import { IAuthHelper } from '@/interfaces/helpers/IAuthHelper';
import { RefreshToken } from '@/models/RefreshToken';
import { UserDTO } from '@/models/User';
import { AuthUtils } from '@/utils/AuthUtils';
import { injectable } from 'inversify';
import jwt, { Secret } from 'jsonwebtoken';
import { Transaction } from 'sequelize';

@injectable()
export class AuthHelper implements IAuthHelper {
  generateAccessToken(userDTO: UserDTO): string {
    return jwt.sign({ user: userDTO }, AuthUtils.getAccessTokenSecret(), {
      expiresIn: AuthUtils.getAccessTokenExpiration(),
    });
  }

  async generateRefreshToken(userDTO: UserDTO, transaction?: Transaction): Promise<string> {
    const refreshToken = jwt.sign({ user: userDTO }, AuthUtils.getRefreshTokenSecret(), {
      expiresIn: AuthUtils.getRefreshTokenExpiration(),
    });
    await RefreshToken.create({ userId: userDTO.id, token: refreshToken }, { transaction });
    return refreshToken;
  }

  verifyAccessToken(accessToken: string): UserDTO {
    return this.validateTokenOrThrow(accessToken, AuthUtils.getAccessTokenSecret()).user;
  }

  verifyRefreshToken = (refreshToken: string): UserDTO => {
    const decoded = this.validateTokenOrThrow(refreshToken, AuthUtils.getRefreshTokenSecret());
    this.findRefreshTokenOrThrow(decoded.user.id, refreshToken);
    return decoded.user;
  };

  private findRefreshTokenOrThrow = async (userId: number, refreshToken: string): Promise<void> => {
    const token = await RefreshToken.findOne({ where: { userId, token: refreshToken } });
    if (!token) {
      throw ApiError.badRequest('Invalid refresh token');
    }
  };

  private validateTokenOrThrow = (token: string, secret: Secret): IUserJWT => {
    try {
      console.log(token);
      const decoded = jwt.verify(token, secret) as IUserJWT;

      return decoded;
    } catch (error) {
      throw ApiError.unauthorized('Invalid token');
    }
  };
}
