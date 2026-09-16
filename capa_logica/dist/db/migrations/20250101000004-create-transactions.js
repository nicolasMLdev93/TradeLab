"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
async function up(queryInterface) {
    await queryInterface.createTable('transactions', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        user_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        wallet_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'wallets', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('buy', 'sell', 'deposit', 'withdrawal', 'transfer_in', 'transfer_out'),
            allowNull: false,
        },
        amount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 8),
            allowNull: false,
        },
        price: {
            type: sequelize_1.DataTypes.DECIMAL(20, 8),
            allowNull: true,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
            allowNull: false,
            defaultValue: 'pending',
        },
        note: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        created_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updated_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
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
async function down(queryInterface) {
    await queryInterface.dropTable('transactions');
}
