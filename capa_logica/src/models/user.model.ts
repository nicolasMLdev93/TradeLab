import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Unique,
  Default,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { Wallet } from './wallet.model';
import { Transaction } from './transaction.model';

export type UserRole = 'user' | 'admin';

@Table({
  tableName: 'users',
  modelName: 'User',
  underscored: true,
  timestamps: true,
})
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(120))
  declare email: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare username: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare passwordHash: string;

  @Default('user')
  @AllowNull(false)
  @Column(DataType.ENUM('user', 'admin'))
  declare role: CreationOptional<UserRole>;

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: CreationOptional<Date>;

  @HasMany(() => Wallet)
  declare wallets: NonAttribute<Wallet[]>;

  @HasMany(() => Transaction)
  declare transactions: NonAttribute<Transaction[]>;
}