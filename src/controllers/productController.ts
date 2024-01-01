// import { ApiError } from '@/errors/ApiError';
import { asyncHandler } from '@/helpers/asyncHandler';
// import { findResourceOrThrow } from '@/helpers/dbHelper';
import { Product } from '@/models/Product';
import { WaybillUnit } from '@/models/WaybillUnit';
import { IProductFiltersOptions } from '@/types/product';
import { AuthRequest } from '@/types/types';
// import { HttpStatus } from '@/utils/httpStatusCodesUtils';
import { Response, NextFunction } from 'express';
import { Op } from 'sequelize';

export class productController {
  // create = asyncHandler(async (req: AuthRequest, _res: Response, _next: NextFunction) => {
  //   const { barcode, name, unitId, price } = req.body;

  //   const existingProduct = await Product.findOne({ where: { barcode } });
  //   if (existingProduct) {
  //     throw ApiError.badRequest('Product already exists');
  //   }

  //   return await Product.create({ barcode, name, unitId, price, userId: req.user.id });
  // }, HttpStatus.CREATED);

  findAll = asyncHandler(async (req: AuthRequest, _res: Response, _next: NextFunction) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const filters: IProductFiltersOptions[] = req.query.filters ? JSON.parse(req.query.filters as string) : {};
    const query = filters
      ? filters.reduce((acc, { key, value }) => {
          if (key === 'unitId') {
            return { ...acc, [key]: parseInt(value, 10) };
          } else {
            return { ...acc, [key]: { [Op.like]: `%${value}%` } };
          }
        }, {})
      : {};

    const offset = (page - 1) * limit;
    console.log('query', query);
    const { count, rows: products } = await Product.findAndCountAll({
      where: query,
      limit,
      offset,
      include: [{ model: WaybillUnit, as: 'unit', attributes: ['name'] }],
    });

    const totalPage = Math.ceil(count / limit);

    return { products, totalItems: count, totalPage, currentPage: page };
  });

  // findOne = asyncHandler(async (req: AuthRequest, _res: Response, _next: NextFunction) => {
  //   return await findResourceOrThrow(Product, req.params.id, req.user);
  // });

  // update = asyncHandler(async (req: AuthRequest, _res: Response, _next: NextFunction) => {
  //   const { id } = req.params;
  //   const { barcode, name, unitId, price } = req.body;

  //   const product = await findResourceOrThrow(Product, id, req.user);

  //   if (!product) {
  //     throw ApiError.notFound('Product not found');
  //   }

  //   await product.update({ barcode, name, unitId, price });

  //   return product;
  // });

  // delete = asyncHandler(async (req: AuthRequest, _res: Response, _next: NextFunction) => {
  //   const { id } = req.params;

  //   const product = await findResourceOrThrow(Product, id, req.user);

  //   if (!product) {
  //     throw ApiError.notFound('Product not found');
  //   }

  //   await product.destroy();

  //   return { message: 'Product deleted successfully' };
  // });
}
