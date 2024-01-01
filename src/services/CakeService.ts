import { Cake, CakeCreationAttributesWithIngredients } from '@/models/Cake';
import { Product } from '@/models/Product';
import sequelize from '@/database/config/sequelize';
import { CakeIngredient } from '@/models/CakeIngredient';
import Transaction from 'sequelize/types/transaction';
import { ApiError } from '@/errors/ApiError';

export class CakeService {
  async createCake({ name, slice, price, ingredients }: CakeCreationAttributesWithIngredients): Promise<Cake> {
    const transaction = await sequelize.transaction();

    try {
      const cake = await Cake.create({ name, slice, price }, { transaction });
      await this.associateIngredients(cake, ingredients, transaction);
      await transaction.commit();
      return cake;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

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
