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
import { User } from './User';

interface IProductAttributes {
  id: number;
  barcode: string;
  name: string;
  unitId: number;
  price: number;
  userId: number;
}

export interface IProductCreationAttributes extends Optional<IProductAttributes, 'id'> {}

@Table({ tableName: 'products' })
export class Product extends Model<IProductAttributes, IProductCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Unique
  @Column(DataType.STRING)
  barcode!: string;

  @Column
  name!: string;

  @Column({ type: DataType.DECIMAL(10, 2) })
  price!: number;

  @ForeignKey(() => WaybillUnit)
  @Column({ field: 'unit_id' })
  unitId!: number;

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => WaybillUnit, { targetKey: 'unitId' })
  unit: WaybillUnit;

  @BelongsToMany(() => Cake, { through: () => CakeIngredient, foreignKey: 'barcode', sourceKey: 'barcode' })
  cakes: Cake[];
}
