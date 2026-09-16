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
import { Currency } from './currency.model';

@Table({
  tableName: 'wallets',
  modelName: 'Wallet',
  underscored: true,
  timestamps: true,
})
export class Wallet extends Model<
  InferAttributes<Wallet>,
  InferCreationAttributes<Wallet>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare userId: number;

  @ForeignKey(() => Currency)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare currencyId: number;

  @Default(0)
  @AllowNull(false)
  @Column(DataType.DECIMAL(20, 8))
  declare balance: CreationOptional<string>;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  declare address: CreationOptional<string | null>;

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: CreationOptional<Date>;

  @BelongsTo(() => User)
  declare user: NonAttribute<User>;

  @BelongsTo(() => Currency)
  declare currency: NonAttribute<Currency>;
}