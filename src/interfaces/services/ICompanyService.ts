import { Company } from '@/models/Company';
import { IAuthRequest } from '../common/IAuth';

export interface ICompanyService {
  create(req: IAuthRequest): Promise<Company>;
  findAll(req: IAuthRequest): Promise<IFindAll>;
  findOne(req: IAuthRequest): Promise<Company>;
  update(req: IAuthRequest): Promise<Company>;
  delete(req: IAuthRequest): Promise<{ message: string }>;
}

export interface IFindAll {
  companies: Company[];
  totalItems: number;
  totalPage: number;
  currentPage: number;
}
