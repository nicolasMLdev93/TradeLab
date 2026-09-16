import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Default,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { User } from './user.model';
import { Wallet } from './wallet.model';

export type TransactionType =
  | 'buy'
  | 'sell'
  | 'deposit'
  | 'withdrawal'
  | 'transfer_in'
  | 'transfer_out';

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

@Table({
  tableName: 'transactions',
  modelName: 'Transaction',
  underscored: true,
  timestamps: true,
})
export class Transaction extends Model<
  InferAttributes<Transaction>,
  InferCreationAttributes<Transaction>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare userId: number;

  @ForeignKey(() => Wallet)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare walletId: number;

  @AllowNull(false)
  @Column(DataType.ENUM('buy', 'sell', 'deposit', 'withdrawal', 'transfer_in', 'transfer_out'))
  declare type: TransactionType;

  @AllowNull(false)
  @Column(DataType.DECIMAL(20, 8))
  declare amount: string;

  @AllowNull(true)
  @Column(DataType.DECIMAL(20, 8))
  declare price: CreationOptional<string | null>;

  @Default('pending')
  @AllowNull(false)
  @Column(DataType.ENUM('pending', 'completed', 'failed', 'cancelled'))
  declare status: CreationOptional<TransactionStatus>;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  declare note: CreationOptional<string | null>;

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: CreationOptional<Date>;

  @BelongsTo(() => User)
  declare user: NonAttribute<User>;

  @BelongsTo(() => Wallet)
  declare wallet: NonAttribute<Wallet>;
}