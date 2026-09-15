import {
  Table, Column, Model, DataType,
  PrimaryKey, AutoIncrement, AllowNull, ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Currency } from './currency.model';

@Table({ tableName: 'transactions', underscored: true })
export class Transaction extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare userId: number;

  @ForeignKey(() => Currency)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare fromCurrencyId: number;

  @ForeignKey(() => Currency)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare toCurrencyId: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(20, 8))
  declare fromAmount: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL(20, 8))
  declare toAmount: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL(20, 8))
  declare rate: string;

  @AllowNull(false)
  @Column(DataType.ENUM('buy', 'sell', 'swap'))
  declare type: 'buy' | 'sell' | 'swap';

  @AllowNull(false)
  @Column(DataType.ENUM('pending', 'completed', 'failed'))
  declare status: 'pending' | 'completed' | 'failed';

  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => Currency, 'fromCurrencyId')
  declare fromCurrency: Currency;

  @BelongsTo(() => Currency, 'toCurrencyId')
  declare toCurrency: Currency;
}