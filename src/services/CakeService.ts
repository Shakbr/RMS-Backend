import { Cake, CakeWithProducts, CakeWithProductsAndNetPrice } from '@/models/Cake';
import { Product } from '@/models/Product';
import { CakeIngredient, ICakeIngredientsWithAmountType } from '@/models/CakeIngredient';
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
import { DataUtils } from '@/utils/DataUtils';

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

  findAll = async (req: IAuthRequest): Promise<IItemPagination<CakeWithProductsAndNetPrice>> => {
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

    const cakesWithNetPrice: CakeWithProductsAndNetPrice[] = cakes.map((cake) => {
      const cakeWithProducts = cake.get() as unknown as CakeWithProducts;
      return {
        ...cakeWithProducts,
        netPrice: this.calculateNetPrice(cakeWithProducts),
      };
    });

    return { items: cakesWithNetPrice, totalItems: count, totalPage, currentPage: page };
  };

  findOne = async (req: IAuthRequest): Promise<CakeWithProductsAndNetPrice> => {
    const cake = await Cake.scope('withProducts').findByPk(req.params.id);
    if (!cake) {
      throw ApiError.notFound('Cake not found');
    }
    // TODO it should be refactored
    const cakeWithProducts = cake.get() as unknown as CakeWithProducts;
    return {
      ...cakeWithProducts,
      netPrice: this.calculateNetPrice(cakeWithProducts),
    };
  };

  update = async (req: IAuthRequest): Promise<Cake> => {
    const { id } = req.params;
    const { name, slice, price, ingredients } = req.body;
    const transaction = await this.databaseConfig.getInstance().transaction();

    try {
      const cake = await Cake.findByPk(id, { transaction });
      if (!cake) {
        throw ApiError.notFound('Cake not found');
      }
      await cake.update({ name, slice, price }, { transaction });
      await CakeIngredient.destroy({ where: { cakeId: cake.id }, transaction });
      await this.associateIngredients(cake, ingredients, transaction);
      await transaction.commit();
      return cake;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  delete = async (req: IAuthRequest): Promise<{ message: string }> => {
    const { id } = req.params;
    const transaction = await this.databaseConfig.getInstance().transaction();

    try {
      const cake = await Cake.findByPk(id, { transaction });
      if (!cake) {
        throw ApiError.notFound('Cake not found');
      }
      await CakeIngredient.destroy({ where: { cakeId: cake.id }, transaction });
      await cake.destroy({ transaction });
      await transaction.commit();
      return { message: 'Cake deleted successfully' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  private associateIngredients = async (
    cake: Cake,
    ingredients: ICakeIngredientsWithAmountType[],
    transaction: Transaction,
  ) => {
    for (const ingredient of ingredients) {
      const product = await Product.findOne({
        where: { barcode: ingredient.barcode },
        transaction,
      });
      if (!product) {
        throw ApiError.notFound(`Product with barcode ${ingredient.barcode} not found`);
      }

      // convert amount type to proper measurement
      const convertedAmount = DataUtils.convertAmountBasedOnType(ingredient.amount, ingredient.amountType);
      console.log('here', {
        cakeId: cake.id,
        barcode: product.barcode,
        amount: convertedAmount,
      });
      await CakeIngredient.create(
        {
          cakeId: cake.id,
          barcode: product.barcode,
          amount: convertedAmount,
        },
        { transaction },
      );
    }
  };

  private calculateNetPrice = (cake: CakeWithProducts): number => {
    const netPrice = cake.products.reduce((acc, product) => {
      return acc + product.price * product.ingredient.amount;
    }, 0);
    return +netPrice.toFixed(2);
  };
}
