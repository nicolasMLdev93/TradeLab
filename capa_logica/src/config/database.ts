import 'reflect-metadata';
import { Sequelize } from 'sequelize-typescript';
import { env } from './env';
import { User } from '../models/user.model';
import { Currency } from '../models/currency.model';
import { Wallet } from '../models/wallet.model';
import { Transaction } from '../models/transaction.model';

export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: env.db.host,
  port: env.db.port,
  database: env.db.name,
  username: env.db.user,
  password: env.db.password,
  logging: env.isDev ? console.log : false,
  models: [User, Currency, Wallet, Transaction],
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

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL OK');
  } catch (error) {
    console.error('❌ Error al conectar la base de datos:', error);
    process.exit(1);
  }
};