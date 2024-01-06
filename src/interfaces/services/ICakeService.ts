import { Cake } from '@/models/Cake';
import { IAuthRequest } from '../common/IAuth';
import { IItemPagination } from '../common/IApi';

export interface ICakeService {
  create(req: IAuthRequest): Promise<Cake>;
  findAll(req: IAuthRequest): Promise<IItemPagination<Cake>>;
}
