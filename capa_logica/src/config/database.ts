import 'reflect-metadata';
import { Sequelize } from 'sequelize-typescript';
import { env } from './env';
import { User } from '../models/user.model';
import { Currency } from '../models/currency.model';
import { Wallet } from '../models/wallet.model';
import { Transaction } from '../models/transaction.model';

const models = [User, Currency, Wallet, Transaction];

export const sequelize =
  env.nodeEnv === 'test'
    ? new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
        models,
      })
    : new Sequelize({
        dialect: 'mysql',
        host: env.db.host,
        port: env.db.port,
        database: env.db.name,
        username: env.db.user,
        password: env.db.password,
        logging: env.isDev ? console.log : false,
        models,
      });

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a DB OK');
  } catch (error) {
    console.error('❌ Error al conectar la base de datos:', error);
    process.exit(1);
  }
};