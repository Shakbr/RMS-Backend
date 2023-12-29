import { Company } from '@/models/Company';
import { Product } from '@/models/Product';
import { WaybillUnit } from '@/models/WaybillUnit';
import { Optional } from 'sequelize';
import { Table, Column, Model, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';

interface WaybillAttributes {
  id: number;
  waybillId: string;
  tinId: number;
  unitId: number;
  quantity: number;
  price: number;
  amount: number;
  barCode: string;
  status: number;
}

interface WaybillCreationAttributes extends Optional<WaybillAttributes, 'id'> {}

@Table({ tableName: 'waybills' })
export class Waybill extends Model<WaybillAttributes, WaybillCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  waybillId!: string;

  @ForeignKey(() => Company)
  @Column(DataType.BIGINT)
  tinId!: number;

  @ForeignKey(() => WaybillUnit)
  @Column
  unitId!: number;

  @Column
  quantity!: number;

  @Column({ type: DataType.DECIMAL(10, 2) })
  price!: number;

  @Column
  amount!: number;

  @ForeignKey(() => Product)
  @Column
  barCode!: string;

  @Column
  status!: number;

  @BelongsTo(() => Company, { targetKey: 'tin' })
  company: Company;

  @BelongsTo(() => Product, { targetKey: 'barCode' })
  product: Product;

  @BelongsTo(() => WaybillUnit, { targetKey: 'unitId' })
  unit: WaybillUnit;
}
