import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('currencies', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    symbol: { type: DataTypes.STRING(10), allowNull: false, unique: true },
    name:   { type: DataTypes.STRING(50), allowNull: false },
    type:   { type: DataTypes.ENUM('fiat', 'crypto'), allowNull: false },
    decimals: { type: DataTypes.TINYINT, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('currencies');
}