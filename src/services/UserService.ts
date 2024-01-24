import { inject, injectable } from 'inversify';
import { Request } from 'express';
import { User, UserDTO } from '@/models/User';
import { ApiError } from '@/errors/ApiError';
import { IUserService } from '@/interfaces/services/IUserService';
import { IAuthenticateUser } from '@/interfaces/common/IAuth';
import bcrypt from 'bcrypt';
import { HELPER_TYPES } from '@/types/helpers';
import { IAuthHelper } from '@/interfaces/helpers/IAuthHelper';
import { RefreshToken } from '@/models/RefreshToken';
import { CONFIG_TYPES } from '@/types/config';
import { IDatabaseConfig } from '@/interfaces/configs/IDatabaseConfig';
import { IDatabaseHelper } from '@/interfaces/helpers/IDatabaseHelper';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(HELPER_TYPES.AuthHelper) private authHelper: IAuthHelper,
    @inject(HELPER_TYPES.DatabaseHelper) private databaseHelper: IDatabaseHelper,
    @inject(CONFIG_TYPES.DatabaseConfig) private databaseConfig: IDatabaseConfig,
  ) {}
  async register(req: Request): Promise<UserDTO> {
    const { email, name, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw ApiError.badRequest('Email already in use');
    }

    return (await User.create({ email, name, password, role })).toDTO();
  }

  login = async (req: Request): Promise<IAuthenticateUser> => {
    const { email, password } = req.body;
    const user = await User.scope('withPassword').findOne({ where: { email } });

    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid credentials');
    }
    const userDTO = user.toDTO();
    const accessToken = this.authHelper.generateAccessToken(userDTO);
    const refreshToken = await this.authHelper.generateRefreshToken(userDTO);
    return { user: userDTO, accessToken, refreshToken };
  };

  regenerateAccessAndRefreshToken = async (req: Request): Promise<IAuthenticateUser> => {
    const refreshToken = req.cookies.refreshToken;
    const userFromDecodedRefreshToken = this.authHelper.verifyRefreshToken(refreshToken);
    const user = await this.databaseHelper.findResourceOrThrow(User, userFromDecodedRefreshToken.id);
    const userDTO = user.toDTO();
    const newToken = this.authHelper.generateAccessToken(userDTO);
    const newRefreshToken = await this.generateRefreshToken(userDTO);
    return { user: userDTO, accessToken: newToken, refreshToken: newRefreshToken };
  };

  private generateRefreshToken = async (user: UserDTO): Promise<string> => {
    const transaction = await this.databaseConfig.getInstance().transaction();
    try {
      await RefreshToken.destroy({ where: { userId: user.id }, transaction });
      const refreshToken = await this.authHelper.generateRefreshToken(user, transaction);
      // Set the refresh token as an HttpOnly cookie
      await transaction.commit();
      return refreshToken;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
}
