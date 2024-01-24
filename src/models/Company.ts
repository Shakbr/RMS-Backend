import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  NotEmpty,
  ForeignKey,
  BelongsTo,
  Unique,
  DataType,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { User } from '@/models/User';

interface CompanyAttributes {
  id: number;
  name: string;
  tin: number;
  userId: number;
}

export interface CompanyCreationAttributes extends Optional<CompanyAttributes, 'id'> {}

@Table({ tableName: 'companies' })
export class Company extends Model<CompanyAttributes, CompanyCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @NotEmpty
  @Column
  name!: string;

  @Unique
  @NotEmpty
  @Column(DataType.BIGINT)
  tin!: number;

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}
