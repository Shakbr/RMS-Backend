import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, ForeignKey } from 'sequelize-typescript';
import { Cake } from './Cake';
import { BasicProduct, Product } from './Product';
import { Optional } from 'sequelize';

interface CakeIngredientAttributes {
  id: number;
  cakeId: number;
  barcode: string;
  amount: number;
}

export enum IngredientType {
  GR = 'gr',
  ML = 'ml',
  COUNT = 'count',
}

export interface CakeIngredientCreationAttributes extends Optional<CakeIngredientAttributes, 'id'> {}
export interface ICakeIngredientsWithAmountType extends CakeIngredientAttributes {
  amountType: IngredientType;
}

export interface ProductWithAmount extends BasicProduct {
  ingredient: {
    amount: CakeIngredientAttributes['amount'];
  };
}

@Table({
  tableName: 'cake_ingredients',
  indexes: [
    {
      unique: true,
      fields: ['cake_id', 'barcode'],
    },
  ],
})
export class CakeIngredient extends Model<CakeIngredientAttributes, CakeIngredientCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id: CakeIngredientAttributes['id'];

  @ForeignKey(() => Cake)
  @Column({ type: DataType.INTEGER, field: 'cake_id' })
  cakeId!: CakeIngredientAttributes['cakeId'];

  @ForeignKey(() => Product)
  @Column(DataType.STRING)
  barcode!: string;

  @Column(DataType.DECIMAL(10, 3))
  amount: CakeIngredientAttributes['amount'];
}
