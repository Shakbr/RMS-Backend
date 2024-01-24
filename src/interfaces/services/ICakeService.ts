import { Cake, CakeWithProductsAndNetPrice } from '@/models/Cake';
import { IAuthRequest } from '../common/IAuth';
import { IItemPagination } from '../common/IApi';

export interface ICakeService {
  create(req: IAuthRequest): Promise<Cake>;
  findAll(req: IAuthRequest): Promise<IItemPagination<CakeWithProductsAndNetPrice>>;
  findOne(req: IAuthRequest): Promise<CakeWithProductsAndNetPrice>;
  update(req: IAuthRequest): Promise<Cake>;
  delete(req: IAuthRequest): Promise<{ message: string }>;
}
