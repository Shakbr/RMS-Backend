import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  BelongsToMany,
  DataType,
  Scopes,
  DefaultScope,
} from 'sequelize-typescript';
import { Product } from './Product';
import { CakeIngredient } from './CakeIngredient';
import { Optional } from 'sequelize';

interface CakeAttributes {
  id: number;
  name: string;
  slice: number;
  price: number;
}

interface CakeCreationAttributes extends Optional<CakeAttributes, 'id'> {}

export interface CakeCreationAttributesWithIngredients extends CakeCreationAttributes {
  ingredients: CakeIngredient[];
}

@DefaultScope(() => ({
  attributes: ['id', 'name', 'slice', 'price'],
}))
@Scopes(() => ({
  withProducts: {
    attributes: ['id', 'name', 'slice', 'price'],
    include: [
      {
        model: Product,
        attributes: ['name', 'price'],
        through: { attributes: ['amount'] },
      },
    ],
  },
}))
@Table({ tableName: 'cakes' })
export class Cake extends Model<CakeAttributes, CakeCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  slice: number;

  @Column(DataType.DECIMAL(10, 2))
  price: number;

  @BelongsToMany(() => Product, {
    through: () => CakeIngredient,
    foreignKey: 'cakeId',
    sourceKey: 'id',
  })
  products: Product[];
}
