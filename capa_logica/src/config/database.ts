import 'reflect-metadata';
import 'dotenv/config';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/user.model';
import { Currency } from '../models/currency.model';
import { Wallet } from '../models/wallet.model';
import { Transaction } from '../models/transaction.model';

const {
  DB_HOST, DB_PORT = '3306', DB_NAME, DB_USER, DB_PASSWORD,
  NODE_ENV = 'development',
} = process.env;

for (const [key, value] of Object.entries({ DB_HOST, DB_NAME, DB_USER, DB_PASSWORD })) {
  if (!value) throw new Error(`❌ Falta la variable de entorno: ${key}`);
}

export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: DB_HOST,
  port: Number(DB_PORT),
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  logging: NODE_ENV === 'development' ? console.log : false,
  models: [User, Currency, Wallet, Transaction],
});