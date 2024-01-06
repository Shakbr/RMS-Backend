import { Product } from '@/models/Product';
import { IAuthRequest } from '../common/IAuth';
import { TProductDataFields } from '@/services/ProductService';
import { IItemPagination } from '../common/IApi';

export interface IProductService {
  create(req: IAuthRequest, data?: TProductDataFields): Promise<Product>;
  findAll(req: IAuthRequest): Promise<IItemPagination<Product>>;
  findOne(req: IAuthRequest): Promise<Product>;
  update(req: IAuthRequest): Promise<Product>;
  delete(req: IAuthRequest): Promise<{ message: string }>;
}
