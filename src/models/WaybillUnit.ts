import { Table, Column, Model, PrimaryKey, AutoIncrement, Unique } from 'sequelize-typescript';
import { Optional } from 'sequelize';

interface WaybillUnitAttributes {
  id: number;
  name: string;
  unitId: number;
}

interface WaybillUnitCreationAttributes extends Optional<WaybillUnitAttributes, 'id'> {}

@Table({ tableName: 'waybill_units' })
export class WaybillUnit extends Model<WaybillUnitAttributes, WaybillUnitCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  name!: string;

  @Unique
  @Column({ field: 'unit_id' })
  unitId!: number;
}
