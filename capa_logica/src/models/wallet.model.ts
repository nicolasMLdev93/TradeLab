import {
  Table, Column, Model, DataType,
  PrimaryKey, AutoIncrement, AllowNull, ForeignKey,
  BelongsTo, Unique,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Currency } from './currency.model';

@Table({
  tableName: 'wallets',
  underscored: true,
  indexes: [{ unique: true, fields: ['user_id', 'currency_id'] }],
})
export class Wallet extends Model {
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
  declare currencyId: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(20, 8))
  declare balance: string;

  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => Currency)
  declare currency: Currency;
}