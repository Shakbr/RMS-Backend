import { UserDTO } from '@/models/User';
import { ModelCtor } from 'sequelize-typescript';
import { TAvailableModels } from '@/types/common';

export interface IDatabaseHelper {
  findResourceOrThrow<M extends keyof TAvailableModels>(
    model: ModelCtor<TAvailableModels[M]>,
    resourceId: string | number,
    user?: UserDTO,
  ): Promise<TAvailableModels[M]>;
}
