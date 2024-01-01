import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Cake } from './Cake';
import { Product } from './Product';
import { Optional } from 'sequelize';

interface CakeIngredientAttributes {
  id: number;
  cakeId: number;
  barcode: string;
  amount: number;
}

export interface CakeIngredientCreationAttributes extends Optional<CakeIngredientAttributes, 'id'> {}

@Table({
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
  cakeId: CakeIngredientAttributes['cakeId'];

  @ForeignKey(() => Product)
  @Column({ type: DataType.STRING(50) })
  barcode: CakeIngredientAttributes['barcode'];

  @Column(DataType.DECIMAL(10, 2))
  amount: CakeIngredientAttributes['amount'];

  @BelongsTo(() => Product, { targetKey: 'barcode' })
  product: Product;

  @BelongsTo(() => Cake, { targetKey: 'id' })
  cake: Cake;
}
