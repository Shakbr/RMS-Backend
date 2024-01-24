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
import { Company } from './Company';

interface IProductAttributes {
  id: number;
  barcode: string;
  name: string;
  unitId: number;
  price: number;
  userId: number;
  tin: number;
  active: number;
}

export interface BasicProduct extends Omit<IProductAttributes, 'id' | 'barcode' | 'unitId' | 'userId | tin | active'> {}

export interface IProductCreationAttributes extends Optional<IProductAttributes, 'id' | 'active'> {}

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

  @Column({
    type: DataType.DECIMAL(10, 2),
    get() {
      const value = this.getDataValue('price');
      return value !== null ? parseFloat(value) : null;
    },
  })
  price!: number;

  @ForeignKey(() => WaybillUnit)
  @Column({ field: 'unit_id' })
  unitId!: number;

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  userId!: number;

  @ForeignKey(() => Company)
  tin!: number;

  @Column({ type: DataType.SMALLINT, defaultValue: 0 })
  active: number;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => WaybillUnit, { targetKey: 'unitId' })
  unit: WaybillUnit;

  @BelongsTo(() => Company, { targetKey: 'tin' })
  company: Company;

  @BelongsToMany(() => Cake, { through: () => CakeIngredient, foreignKey: 'barcode', sourceKey: 'barcode' })
  cakes: Cake[];

  // @BeforeCreate
  // @BeforeUpdate
  // static generateUniqueBarcode(instance: Product): void {
  //   instance.barcode = DataUtils.generateUniqueBarcode(instance.barcode, instance.tin);
  // }
}
