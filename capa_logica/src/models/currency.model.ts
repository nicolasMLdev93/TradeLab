import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Unique,
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

export type CurrencyType = 'fiat' | 'crypto';

@Table({
  tableName: 'currencies',
  modelName: 'Currency',
  underscored: true,
  timestamps: true,
})
export class Currency extends Model<
  InferAttributes<Currency>,
  InferCreationAttributes<Currency>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(10))
  declare symbol: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare name: string;

  @AllowNull(false)
  @Column(DataType.ENUM('fiat', 'crypto'))
  declare type: CurrencyType;

  @AllowNull(false)
  @Column(DataType.TINYINT)
  declare decimals: number;

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: CreationOptional<Date>;

  @HasMany(() => Wallet)
  declare wallets: NonAttribute<Wallet[]>;
}