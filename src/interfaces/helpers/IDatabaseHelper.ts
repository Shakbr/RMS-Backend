import { Company } from '@/models/Company';
import { UserDTO } from '@/models/User';
import { ModelCtor } from 'sequelize-typescript';

export interface IDatabaseHelper {
  findResourceOrThrow<M extends keyof IModels>(
    model: ModelCtor<IModels[M]>,
    resourceId: string | number,
    user: UserDTO,
  ): Promise<IModels[M]>;
}

export interface IModels {
  // here should be all models, which you want to use in this file
  Company: Company;
}
