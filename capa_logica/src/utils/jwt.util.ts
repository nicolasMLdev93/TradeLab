import jwt from 'jsonwebtoken';
import type { SignOptions as JwtSignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

export const signAccessToken = (payload: JwtPayload): string =>
  jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn as JwtSignOptions['expiresIn'],
  });

export const signRefreshToken = (payload: JwtPayload): string =>
  jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn as JwtSignOptions['expiresIn'],
  });

export const verifyAccessToken = (token: string): JwtPayload =>
  jwt.verify(token, env.jwt.secret) as JwtPayload;

export const verifyRefreshToken = (token: string): JwtPayload =>
  jwt.verify(token, env.jwt.refreshSecret) as JwtPayload;