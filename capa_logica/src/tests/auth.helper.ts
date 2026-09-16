import request from 'supertest';
import type { Express } from 'express';
import { createApp } from '../index';
import { User } from '../models/user.model';

export const app: Express = createApp();

export interface TestUser {
  username: string;
  email: string;
  password: string;
}

export const registerUser = async (user: TestUser) => {
  return request(app).post('/api/auth/register').send({
    ...user,
    confirmPassword: user.password,
  });
};

export const loginUser = async (email: string, password: string) => {
  return request(app).post('/api/auth/login').send({ email, password });
};

export const createUserAndGetToken = async (overrides: Partial<TestUser> = {}) => {
  const user: TestUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'Password123',
    ...overrides,
  };

  const res = await registerUser(user);

  if (res.status !== 201) {
    throw new Error(`Failed to register user: ${JSON.stringify(res.body)}`);
  }

  return {
    user: res.body.user,
    accessToken: res.body.accessToken as string,
    password: user.password,
  };
};

export const createAdminAndGetToken = async (overrides: Partial<TestUser> = {}) => {
  const { user, password } = await createUserAndGetToken({
    username: 'admin',
    email: 'admin@example.com',
    ...overrides,
  });

  await User.update({ role: 'admin' }, { where: { id: user.id } });

  const login = await loginUser(user.email, password);
  return {
    user: login.body.user,
    accessToken: login.body.accessToken as string,
  };
};