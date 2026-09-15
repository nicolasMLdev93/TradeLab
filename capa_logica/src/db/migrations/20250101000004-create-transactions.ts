import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('transactions', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    from_currency_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'currencies', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    to_currency_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'currencies', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    from_amount: { type: DataTypes.DECIMAL(20, 8), allowNull: false },
    to_amount:   { type: DataTypes.DECIMAL(20, 8), allowNull: false },
    rate:        { type: DataTypes.DECIMAL(20, 8), allowNull: false },
    type:   { type: DataTypes.ENUM('buy', 'sell', 'swap'), allowNull: false },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      allowNull: false,
      defaultValue: 'completed',
    },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  });

  await queryInterface.addIndex('transactions', ['user_id']);
  await queryInterface.addIndex('transactions', ['created_at']);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('transactions');
}