import { Company } from '@/models/Company';
import { IAuthRequest } from '../common/IAuth';
import { TCompanyDataFields } from '@/services/CompanyService';
import { IItemPagination } from '../common/IApi';

export interface ICompanyService {
  create(req: IAuthRequest, data?: TCompanyDataFields): Promise<Company>;
  findAll(req: IAuthRequest): Promise<IItemPagination<Company>>;
  findOne(req: IAuthRequest): Promise<Company>;
  update(req: IAuthRequest): Promise<Company>;
  delete(req: IAuthRequest): Promise<{ message: string }>;
}
