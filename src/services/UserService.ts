import { injectable } from 'inversify';
import { Request } from 'express';
import { User, UserDTO } from '@/models/User';
import { ApiError } from '@/errors/ApiError';
import { IUserService } from '@/interfaces/services/IUserService';
import { IAuthenticateUser } from '@/interfaces/common/IAuth';
import bcrypt from 'bcrypt';
import { AuthUtils } from '@/utils/AuthUtils';

@injectable()
export class UserService implements IUserService {
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
    return { user: userDTO, token: AuthUtils.generateToken(userDTO) };
  };
}
