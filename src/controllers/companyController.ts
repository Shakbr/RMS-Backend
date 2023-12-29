import { AuthRequest } from './../types/types';
import { Response, NextFunction } from 'express';
import { Company } from '../models/Company';
import { asyncHandler } from '../helpers/asyncHandler';
import { HttpStatus } from '../utils/httpStatusCodesUtils';
import { ApiError } from '@/errors/ApiError';
import { findResourceOrThrow } from '@/helpers/dbHelper';

export class CompanyController {
  create = asyncHandler(async (req: AuthRequest, _res: Response, _next: NextFunction) => {
    const { name, tin } = req.body;

    const existingCompany = await Company.findOne({ where: { name } });
    if (existingCompany) {
      throw ApiError.badRequest('Company already exists');
    }

    return await Company.create({ name, tin, userId: req.user.id });
  }, HttpStatus.CREATED);

  findAll = asyncHandler(async (req: AuthRequest, _res: Response, _next: NextFunction) => {
    const query = {};
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;

    const offset = (page - 1) * limit;

    const { count, rows: companies } = await Company.findAndCountAll({ where: query, limit, offset });

    const totalPage = Math.ceil(count / limit);

    return { companies, totalItems: count, totalPage, currentPage: page };
  });

  findOne = asyncHandler(async (req: AuthRequest, _res: Response, _next: NextFunction) => {
    return await findResourceOrThrow(Company, req.params.id, req.user);
  });

  update = asyncHandler(async (req: AuthRequest, _res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const { name, tin } = req.body;

    const company = await findResourceOrThrow(Company, id, req.user);

    if (!company) {
      throw ApiError.notFound('Company not found');
    }

    await company.update({ name, tin });

    return company;
  });

  delete = asyncHandler(async (req: AuthRequest, _res: Response, _next: NextFunction) => {
    const { id } = req.params;

    const company = await findResourceOrThrow(Company, id, req.user);

    if (!company) {
      throw ApiError.notFound('Company not found');
    }

    await company.destroy();

    return { message: 'Company deleted successfully' };
  });
}
