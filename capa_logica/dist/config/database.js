"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
require("reflect-metadata");
require("dotenv/config");
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("../models/user.model");
const currency_model_1 = require("../models/currency.model");
const wallet_model_1 = require("../models/wallet.model");
const transaction_model_1 = require("../models/transaction.model");
const { DB_HOST, DB_PORT = '3306', DB_NAME, DB_USER, DB_PASSWORD, NODE_ENV = 'development', } = process.env;
for (const [key, value] of Object.entries({ DB_HOST, DB_NAME, DB_USER, DB_PASSWORD })) {
    if (!value)
        throw new Error(`❌ Falta la variable de entorno: ${key}`);
}
exports.sequelize = new sequelize_typescript_1.Sequelize({
    dialect: 'mysql',
    host: DB_HOST,
    port: Number(DB_PORT),
    database: DB_NAME,
    username: DB_USER,
    password: DB_PASSWORD,
    logging: NODE_ENV === 'development' ? console.log : false,
    models: [user_model_1.User, currency_model_1.Currency, wallet_model_1.Wallet, transaction_model_1.Transaction],
});
