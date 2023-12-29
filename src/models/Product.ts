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
} from 'sequelize-typescript';

interface ProductAttributes {
  id: number;
  barCode: string;
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
  barCode!: string;

  @Column
  name!: string;

  @Column({ type: DataType.DECIMAL(10, 2) })
  price!: number;

  @ForeignKey(() => WaybillUnit)
  @Column
  unitId!: number;

  @BelongsTo(() => WaybillUnit, { targetKey: 'unitId' })
  unit: WaybillUnit;
}
