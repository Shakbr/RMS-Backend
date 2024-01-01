import { WaybillUnit } from '@/models/WaybillUnit';
import { Optional } from 'sequelize';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  Unique,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { Cake } from './Cake';
import { CakeIngredient } from './CakeIngredient';

interface ProductAttributes {
  id: number;
  barcode: string;
  name: string;
  unitId: number;
  price: number;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> {}

@Table({ tableName: 'products' })
export class Product extends Model<ProductAttributes, ProductCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Unique
  @Column
  barcode!: string;

  @Column
  name!: string;

  @Column({ type: DataType.DECIMAL(10, 2) })
  price!: number;

  @ForeignKey(() => WaybillUnit)
  @Column({ field: 'unit_id' })
  unitId!: number;

  @BelongsTo(() => WaybillUnit, { targetKey: 'unitId' })
  unit: WaybillUnit;

  @BelongsToMany(() => Cake, () => CakeIngredient)
  cakes: Cake[];
}
