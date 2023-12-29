import { Company } from '@/models/Company';
import { isAdmin } from '@/utils/authUtils';
import { ApiError } from '../errors/ApiError';
import { ModelCtor } from 'sequelize-typescript';
import { UserDTO } from '@/models/User';

interface IModels {
  Company: Company;
}

export const findResourceOrThrow = async <M extends keyof IModels>(
  model: ModelCtor<IModels[M]>,
  resourceId: string | number,
  user: UserDTO,
): Promise<IModels[M]> => {
  const resource = await model.findByPk(resourceId);
  if (!resource) {
    throw ApiError.notFound(`${model.name} not found with ID: ${resourceId}`);
  } else if (resource.userId !== user.id && !isAdmin(user)) {
    throw ApiError.forbidden('You do not have permission to access this resource');
  }
  return resource;
};
