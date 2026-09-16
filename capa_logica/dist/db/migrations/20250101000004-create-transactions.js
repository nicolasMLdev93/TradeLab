"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
function up(queryInterface) {
    return __awaiter(this, void 0, void 0, function* () {
        yield queryInterface.createTable('transactions', {
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
        yield queryInterface.addIndex('transactions', ['user_id'], {
            name: 'transactions_user_id_idx',
        });
        yield queryInterface.addIndex('transactions', ['wallet_id'], {
            name: 'transactions_wallet_id_idx',
        });
        yield queryInterface.addIndex('transactions', ['status'], {
            name: 'transactions_status_idx',
        });
        yield queryInterface.addIndex('transactions', ['created_at'], {
            name: 'transactions_created_at_idx',
        });
    });
}
function down(queryInterface) {
    return __awaiter(this, void 0, void 0, function* () {
        yield queryInterface.dropTable('transactions');
    });
}
