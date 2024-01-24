import { ApiError } from '@/errors/ApiError';
import { IItemFilterOptions, IItemPagination } from '@/interfaces/common/IApi';
import { IAuthRequest } from '@/interfaces/common/IAuth';
import { IDatabaseHelper } from '@/interfaces/helpers/IDatabaseHelper';
import { IProductService } from '@/interfaces/services/IProductService';
import { IProductCreationAttributes, Product } from '@/models/Product';
import { WaybillUnit } from '@/models/WaybillUnit';
import { HELPER_TYPES } from '@/types/helpers';
import { DataUtils } from '@/utils/DataUtils';
import { inject, injectable } from 'inversify';
import { Op } from 'sequelize';

export type TProductDataFields = Omit<IProductCreationAttributes, 'userId'> | undefined;
@injectable()
export class ProductService implements IProductService {
  constructor(@inject(HELPER_TYPES.DatabaseHelper) private databaseHelper: IDatabaseHelper) {}
  // TODO it should be refactored
  async create(req: IAuthRequest, data?: TProductDataFields): Promise<Product> {
    const { barcode, name, unitId, price, tin } = data ? data : req.body;
    // TODO this uniqueBarcode implementation should be refactored
    const uniqueBarcode = DataUtils.generateUniqueBarcode(barcode, tin);
    const [product, created] = await Product.findOrCreate({
      where: { barcode: uniqueBarcode },
      defaults: { barcode: uniqueBarcode, name, unitId, price, userId: req.user.id, tin },
    });
    if (!created && !data) throw ApiError.badRequest('Product already exists');

    return product;
  }

  async findOne(req: IAuthRequest): Promise<Product> {
    return await this.databaseHelper.findResourceOrThrow(Product, req.params.id, req.user);
  }

  async findAll(req: IAuthRequest): Promise<IItemPagination<Product>> {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const filters: IItemFilterOptions[] = req.query.filters ? JSON.parse(req.query.filters as string) : null;
    const query = filters
      ? filters.reduce((acc, { key, value }) => {
          if (key === 'unitId' || key === 'active') {
            return { ...acc, [key]: parseInt(value, 10) };
          } else {
            return { ...acc, [key]: { [Op.like]: `%${value}%` } };
          }
        }, {})
      : {};
    const offset = (page - 1) * limit;
    const { count, rows: products } = await Product.findAndCountAll({
      where: query,
      limit,
      offset,
      include: [{ model: WaybillUnit, as: 'unit', attributes: ['name'] }],
    });
    const totalPage = Math.ceil(count / limit);
    // const products = rows.map((item) => {
    //   return {
    //     ...item.get(),
    //   };
    // });

    return { items: products, totalItems: count, totalPage, currentPage: page };
  }

  async update(req: IAuthRequest): Promise<Product> {
    const { id } = req.params;
    const { barcode, name, unitId, price } = req.body;

    const product = await this.databaseHelper.findResourceOrThrow(Product, id, req.user);
    // TODO here barcode won't be unique, so it will throw an error
    await product.update({ barcode, name, unitId, price });

    return product;
  }

  async delete(req: IAuthRequest): Promise<{ message: string }> {
    const { id } = req.params;

    const product = await this.databaseHelper.findResourceOrThrow(Product, id, req.user);

    await product.destroy();

    return { message: 'Product deleted successfully' };
  }
}
