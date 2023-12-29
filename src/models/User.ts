import { Optional } from 'sequelize';
import {
  Table,
  Column,
  Model,
  DataType,
  BeforeCreate,
  BeforeUpdate,
  IsEmail,
  Length,
  NotEmpty,
  IsIn,
  PrimaryKey,
  AutoIncrement,
  Unique,
  Default,
  AllowNull,
  DefaultScope,
  Scopes,
} from 'sequelize-typescript';
import bcrypt from 'bcrypt';

export enum Password {
  MIN_LENGTH = 8,
  MAX_LENGTH = 128,
}

export enum Role {
  ADMIN = 'admin',
  REGULAR = 'regular',
}

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}
export interface UserDTO extends Omit<UserAttributes, 'password'> {}

@DefaultScope(() => ({
  attributes: ['id', 'name', 'email', 'role'], // default fields to select
}))
@Scopes(() => ({
  withPassword: {
    // define a new scope that includes the password
    attributes: ['id', 'name', 'email', 'password', 'role'],
  },
}))
@Table({ tableName: 'users' })
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @NotEmpty({ msg: 'name must not be empty' })
  @Length({ min: 1, max: 128, msg: 'name must be between 1 and 128 characters long' })
  @Column(DataType.STRING)
  name!: string;

  @AllowNull(false)
  @Unique
  @IsEmail
  @NotEmpty
  @Column(DataType.STRING)
  email!: string;

  @AllowNull(false)
  @NotEmpty
  @Length({
    min: Password.MIN_LENGTH,
    max: Password.MAX_LENGTH,
    msg: `password must be between ${Password.MIN_LENGTH} and ${Password.MAX_LENGTH} characters long`,
  })
  @Column(DataType.STRING)
  password!: string;

  @AllowNull(false)
  @Default(Role.REGULAR)
  @IsIn({ msg: `role must be either ${Role.ADMIN} or ${Role.REGULAR}`, args: [[Role.ADMIN, Role.REGULAR]] })
  @Column(DataType.STRING)
  role!: string;

  @BeforeCreate
  static async hashPasswordBC(user: User) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  @BeforeUpdate
  static async hashPasswordBU(user: User) {
    if (user.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  }

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  static validateEmail(email: string): boolean {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,4}\.[0-9]{1,4}\.[0-9]{1,4}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
  }

  toDTO(): UserDTO {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
    };
  }
}
