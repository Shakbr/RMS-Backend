import { ApiError } from '@/errors/ApiError';
import { IAuthRequest } from '@/interfaces/common/IAuth';
import { IDatabaseHelper } from '@/interfaces/helpers/IDatabaseHelper';
import { ICompanyService, IFindAll } from '@/interfaces/services/ICompanyService';
import { Company } from '@/models/Company';
import { HELPER_TYPES } from '@/types/helpers';
import { inject, injectable } from 'inversify';

@injectable()
export class CompanyService implements ICompanyService {
  constructor(@inject(HELPER_TYPES.DatabaseHelper) private databaseHelper: IDatabaseHelper) {}

  create = async (req: IAuthRequest): Promise<Company> => {
    const { name, tin } = req.body;

    const existingCompany = await Company.findOne({ where: { name } });
    if (existingCompany) {
      throw ApiError.badRequest('Company already exists');
    }

    return await Company.create({ name, tin, userId: req.user.id });
  };

  findAll = async (req: IAuthRequest): Promise<IFindAll> => {
    const query = {};
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;

    const offset = (page - 1) * limit;

    const { count, rows: companies } = await Company.findAndCountAll({ where: query, limit, offset });

    const totalPage = Math.ceil(count / limit);

    return { companies, totalItems: count, totalPage, currentPage: page };
  };

  findOne = async (req: IAuthRequest): Promise<Company> => {
    return await this.databaseHelper.findResourceOrThrow(Company, req.params.id, req.user);
  };

  update = async (req: IAuthRequest): Promise<Company> => {
    const { id } = req.params;
    const { name, tin } = req.body;

    const company = await this.databaseHelper.findResourceOrThrow(Company, id, req.user);

    if (!company) {
      throw ApiError.notFound('Company not found');
    }

    company.name = name;
    company.tin = tin;

    return await company.save();
  };

  delete = async (req: IAuthRequest): Promise<{ message: string }> => {
    const { id } = req.params;

    const company = await this.databaseHelper.findResourceOrThrow(Company, id, req.user);

    if (!company) {
      throw ApiError.notFound('Company not found');
    }

    await company.destroy();

    return { message: 'Company deleted successfully' };
  };
}
