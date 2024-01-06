import { AuthUtils } from '@/utils/AuthUtils';
import { ApiError } from '../errors/ApiError';
import { ModelCtor } from 'sequelize-typescript';
import { UserDTO } from '@/models/User';
import { injectable } from 'inversify';
import { IDatabaseHelper } from '@/interfaces/helpers/IDatabaseHelper';
import { TAvailableModels } from '@/types/common';

@injectable()
export class DatabaseHelper implements IDatabaseHelper {
  async findResourceOrThrow<M extends keyof TAvailableModels>(
    model: ModelCtor<TAvailableModels[M]>,
    resourceId: string | number,
    user: UserDTO,
  ): Promise<TAvailableModels[M]> {
    const resource = await model.findByPk(resourceId);
    if (!resource) {
      throw ApiError.notFound(`${model.name} not found with ID: ${resourceId}`);
    } else if (resource.userId !== user.id && !AuthUtils.isAdmin(user)) {
      throw ApiError.forbidden('You do not have permission to access this resource');
    }
    return resource;
  }
}
