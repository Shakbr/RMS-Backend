import { ApiError } from '@/errors/ApiError';
import { IItemPagination } from '@/interfaces/common/IApi';
import { IAuthRequest } from '@/interfaces/common/IAuth';
import { IDatabaseHelper } from '@/interfaces/helpers/IDatabaseHelper';
import { ICompanyService } from '@/interfaces/services/ICompanyService';
import { Company, CompanyCreationAttributes } from '@/models/Company';
import { HELPER_TYPES } from '@/types/helpers';
import { inject, injectable } from 'inversify';

export type TCompanyDataFields = Omit<CompanyCreationAttributes, 'userId'> | undefined;
@injectable()
export class CompanyService implements ICompanyService {
  constructor(@inject(HELPER_TYPES.DatabaseHelper) private databaseHelper: IDatabaseHelper) {}

  create = async (req: IAuthRequest, data?: TCompanyDataFields): Promise<Company> => {
    const { name, tin } = data ? data : req.body;

    const [company, created] = await Company.findOrCreate({
      where: { tin },
      defaults: { name, tin, userId: req.user.id },
    });

    if (!data && !created) {
      throw ApiError.badRequest('Company already exists');
    }

    return company;
  };

  findAll = async (req: IAuthRequest): Promise<IItemPagination<Company>> => {
    const query = {};
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;

    const offset = (page - 1) * limit;

    const { count, rows: companies } = await Company.findAndCountAll({ where: query, limit, offset });

    const totalPage = Math.ceil(count / limit);

    return { items: companies, totalItems: count, totalPage, currentPage: page };
  };

  findOne = async (req: IAuthRequest): Promise<Company> => {
    return await this.databaseHelper.findResourceOrThrow(Company, req.params.id, req.user);
  };

  update = async (req: IAuthRequest): Promise<Company> => {
    const { id } = req.params;
    const { name, tin } = req.body;

    const company = await this.databaseHelper.findResourceOrThrow(Company, id, req.user);

    company.name = name;
    company.tin = tin;

    return await company.save();
  };

  delete = async (req: IAuthRequest): Promise<{ message: string }> => {
    const { id } = req.params;

    const company = await this.databaseHelper.findResourceOrThrow(Company, id, req.user);

    await company.destroy();

    return { message: 'Company deleted successfully' };
  };
}
