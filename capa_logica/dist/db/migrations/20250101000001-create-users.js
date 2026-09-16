"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
async function up(queryInterface) {
    await queryInterface.createTable('users', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: sequelize_1.DataTypes.STRING(120),
            allowNull: false,
            unique: true,
        },
        username: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        password_hash: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        role: {
            type: sequelize_1.DataTypes.ENUM('user', 'admin'),
            allowNull: false,
            defaultValue: 'user',
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
}
async function down(queryInterface) {
    await queryInterface.dropTable('users');
}
