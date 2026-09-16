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
exports.connectDatabase = exports.sequelize = void 0;
require("reflect-metadata");
const sequelize_typescript_1 = require("sequelize-typescript");
const env_1 = require("./env");
const user_model_1 = require("../models/user.model");
const currency_model_1 = require("../models/currency.model");
const wallet_model_1 = require("../models/wallet.model");
const transaction_model_1 = require("../models/transaction.model");
exports.sequelize = new sequelize_typescript_1.Sequelize({
    dialect: 'mysql',
    host: env_1.env.db.host,
    port: env_1.env.db.port,
    database: env_1.env.db.name,
    username: env_1.env.db.user,
    password: env_1.env.db.password,
    logging: env_1.env.isDev ? console.log : false,
    models: [user_model_1.User, currency_model_1.Currency, wallet_model_1.Wallet, transaction_model_1.Transaction],
    define: {
        timestamps: true,
        underscored: true,
        paranoid: false,
    },
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});
const connectDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.sequelize.authenticate();
        console.log('✅ Conexión a MySQL OK');
    }
    catch (error) {
        console.error('❌ Error al conectar la base de datos:', error);
        process.exit(1);
    }
});
exports.connectDatabase = connectDatabase;
