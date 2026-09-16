import 'reflect-metadata';
import 'dotenv/config';

process.env.NODE_ENV = 'test';
process.env.BCRYPT_ROUNDS = '4';

import { sequelize } from '../config/database';

beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});