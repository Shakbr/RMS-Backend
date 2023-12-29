import { User, UserDTO } from '@/models/User';
import { ApiError } from '../errors/ApiError';
import bcrypt from 'bcrypt';
import { generateToken } from '@/utils/authUtils';

interface AuthenticateUser {
  user: UserDTO;
  token: string;
}

export const authenticateUser = async (email: string, password: string): Promise<AuthenticateUser> => {
  const user = await User.scope('withPassword').findOne({ where: { email } });

  if (!user) {
    throw ApiError.unauthorized('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid credentials');
  }
  const userDTO = user.toDTO();

  return { user: userDTO, token: generateToken(userDTO) };
};
