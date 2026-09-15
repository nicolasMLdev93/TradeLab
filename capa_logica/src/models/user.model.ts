import {
  Table, Column, Model, DataType,
  PrimaryKey, AutoIncrement, AllowNull, Unique,
  HasMany,
} from 'sequelize-typescript';
import { Wallet } from './wallet.model';
import { Transaction } from './transaction.model';

@Table({ tableName: 'users', underscored: true })
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

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

  @HasMany(() => Wallet)
  declare wallets: Wallet[];

  @HasMany(() => Transaction)
  declare transactions: Transaction[];
}