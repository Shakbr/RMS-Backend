import { Cake } from '@/models/Cake';
import { Product } from '@/models/Product';
import { CakeIngredient } from '@/models/CakeIngredient';
import Transaction from 'sequelize/types/transaction';
import { ApiError } from '@/errors/ApiError';
import { ICakeService } from '@/interfaces/services/ICakeService';
import { inject, injectable } from 'inversify';
import { CONFIG_TYPES } from '@/types/config';
import { IDatabaseConfig } from '@/interfaces/configs/IDatabaseConfig';
import { IAuthRequest } from '@/interfaces/common/IAuth';
import { IItemFilterOptions } from '@/interfaces/common/IApi';
import { Op } from 'sequelize';
import { IItemPagination } from '../interfaces/common/IApi';

@injectable()
export class CakeService implements ICakeService {
  constructor(@inject(CONFIG_TYPES.DatabaseConfig) private databaseConfig: IDatabaseConfig) {}
  create = async (req: IAuthRequest): Promise<Cake> => {
    const { name, slice, price, ingredients } = req.body;
    const transaction = await this.databaseConfig.getInstance().transaction();

    try {
      const cake = await Cake.create({ name, slice, price }, { transaction });
      await this.associateIngredients(cake, ingredients, transaction);
      await transaction.commit();
      return cake;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  findAll = async (req: IAuthRequest): Promise<IItemPagination<Cake>> => {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const filters: IItemFilterOptions[] = req.query.filters ? JSON.parse(req.query.filters as string) : null;
    const offset = (page - 1) * limit;
    const query = filters
      ? filters.reduce((acc, { key, value }) => {
          if (key === 'unitId') {
            return { ...acc, [key]: parseInt(value, 10) };
          } else {
            return { ...acc, [key]: { [Op.like]: `%${value}%` } };
          }
        }, {})
      : {};
    const { count, rows: cakes } = await Cake.scope('withProducts').findAndCountAll({
      where: query,
      limit,
      offset,
    });
    const totalPage = Math.ceil(count / limit);

    return { items: cakes, totalItems: count, totalPage, currentPage: page };
  };

  private async associateIngredients(cake: Cake, ingredients: CakeIngredient[], transaction: Transaction) {
    for (const ingredient of ingredients) {
      const product = await Product.findOne({
        where: { barcode: ingredient.barcode },
        transaction,
      });
      if (!product) {
        throw ApiError.notFound(`Product with barcode ${ingredient.barcode} not found`);
      }
      await CakeIngredient.create(
        {
          cakeId: cake.id,
          barcode: product.barcode,
          amount: ingredient.amount,
        },
        { transaction },
      );
    }
  }
}
