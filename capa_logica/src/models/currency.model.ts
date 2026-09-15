import {
  Table, Column, Model, DataType,
  PrimaryKey, AutoIncrement, AllowNull, Unique,
  HasMany,
} from 'sequelize-typescript';
import { Wallet } from './wallet.model';

@Table({ tableName: 'currencies', underscored: true })
export class Currency extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(10))
  declare symbol: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare name: string;

  @AllowNull(false)
  @Column(DataType.ENUM('fiat', 'crypto'))
  declare type: 'fiat' | 'crypto';

  @AllowNull(false)
  @Column(DataType.TINYINT)
  declare decimals: number;

  @HasMany(() => Wallet)
  declare wallets: Wallet[];
}