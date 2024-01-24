import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';

interface RefreshTokenAttributes {
  token: string;
  userId: number;
}

@Table({ tableName: 'refresh_tokens' })
export class RefreshToken extends Model<RefreshTokenAttributes> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  token: string;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId: number;

  @BelongsTo(() => User)
  user: User;

  // @Column(DataType.DATE)
  // expiresAt: Date;
}
