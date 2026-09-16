import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('transactions', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },

    wallet_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'wallets', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },

    type: {
      type: DataTypes.ENUM(
        'buy',
        'sell',
        'deposit',
        'withdrawal',
        'transfer_in',
        'transfer_out'
      ),
      allowNull: false,
    },

    amount: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
    },

    price: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },

    note: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Índices para queries frecuentes
  await queryInterface.addIndex('transactions', ['user_id'], {
    name: 'transactions_user_id_idx',
  });

  await queryInterface.addIndex('transactions', ['wallet_id'], {
    name: 'transactions_wallet_id_idx',
  });

  await queryInterface.addIndex('transactions', ['status'], {
    name: 'transactions_status_idx',
  });

  await queryInterface.addIndex('transactions', ['created_at'], {
    name: 'transactions_created_at_idx',
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('transactions');
}