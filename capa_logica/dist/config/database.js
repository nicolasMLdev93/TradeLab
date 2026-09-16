"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = exports.sequelize = void 0;
require("reflect-metadata");
const sequelize_typescript_1 = require("sequelize-typescript");
const env_1 = require("./env");
const user_model_1 = require("../models/user.model");
const currency_model_1 = require("../models/currency.model");
const wallet_model_1 = require("../models/wallet.model");
const transaction_model_1 = require("../models/transaction.model");
const models = [user_model_1.User, currency_model_1.Currency, wallet_model_1.Wallet, transaction_model_1.Transaction];
exports.sequelize = env_1.env.nodeEnv === 'test'
    ? new sequelize_typescript_1.Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
        models,
    })
    : new sequelize_typescript_1.Sequelize({
        dialect: 'mysql',
        host: env_1.env.db.host,
        port: env_1.env.db.port,
        database: env_1.env.db.name,
        username: env_1.env.db.user,
        password: env_1.env.db.password,
        logging: env_1.env.isDev ? console.log : false,
        models,
    });
const connectDatabase = async () => {
    try {
        await exports.sequelize.authenticate();
        console.log('✅ Conexión a DB OK');
    }
    catch (error) {
        console.error('❌ Error al conectar la base de datos:', error);
        process.exit(1);
    }
};
exports.connectDatabase = connectDatabase;
