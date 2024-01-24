import { Company } from '@/models/Company';
import { Product } from '@/models/Product';
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
  DataType,
  AllowNull,
} from 'sequelize-typescript';

interface WaybillAttributes {
  id: number;
  waybillId: string;
  tin: number;
  unitId: number;
  quantity: number;
  price: number;
  amount: number;
  barcode: string;
  status: number;
  beginDate: Date;
  closeDate: Date;
}

interface WaybillCreationAttributes extends Optional<WaybillAttributes, 'id'> {}

@Table({ tableName: 'waybills' })
export class Waybill extends Model<WaybillAttributes, WaybillCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column({ field: 'waybill_id' })
  waybillId!: string;

  @ForeignKey(() => Company)
  @Column({ field: 'tin', type: DataType.BIGINT })
  tin!: number;

  @ForeignKey(() => WaybillUnit)
  @Column({ field: 'unit_id' })
  unitId!: number;

  @Column
  quantity!: number;

  @Column({ type: DataType.DECIMAL(10, 2) })
  price!: number;

  @Column
  amount!: number;

  @ForeignKey(() => Product)
  @Column
  barcode!: string;

  @Column
  status!: number;

  @AllowNull
  @Column({ field: 'begin_date' })
  beginDate!: Date;

  @AllowNull
  @Column({ field: 'close_date' })
  closeDate!: Date;

  @BelongsTo(() => Company, { targetKey: 'tin' })
  company: Company;

  @BelongsTo(() => Product, { targetKey: 'barcode' })
  product: Product;

  @BelongsTo(() => WaybillUnit, { targetKey: 'unitId' })
  unit: WaybillUnit;
}
