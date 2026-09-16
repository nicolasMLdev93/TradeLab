import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { User } from '../models/user.model';
import { HttpError } from '../utils/httpError';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  type JwtPayload,
} from '../utils/jwt.util';

export interface PublicUser {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
}

export interface AuthResult {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
}

const sanitizeUser = (user: User): PublicUser => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

const buildTokens = (user: User) => {
  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
};

export const registerUser = async (input: {
  username: string;
  email: string;
  password: string;
}): Promise<AuthResult> => {
  const { username, email, password } = input;

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new HttpError(409, 'El email ya está registrado');
  }

  const passwordHash = await bcrypt.hash(password, env.bcrypt.rounds);

  const user = await User.create({
    username,
    email,
    passwordHash,
    role: 'user',
  });

  return {
    user: sanitizeUser(user),
    ...buildTokens(user),
  };
};

export const loginUser = async (input: {
  email: string;
  password: string;
}): Promise<AuthResult> => {
  const { email, password } = input;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new HttpError(401, 'Credenciales inválidas');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new HttpError(401, 'Credenciales inválidas');
  }

  return {
    user: sanitizeUser(user),
    ...buildTokens(user),
  };
};

export const refreshUserTokens = async (refreshToken: string) => {
  let decoded: JwtPayload;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new HttpError(401, 'Refresh token inválido');
  }

  const user = await User.findByPk(decoded.id);
  if (!user) {
    throw new HttpError(404, 'Usuario no encontrado');
  }

  return buildTokens(user);
};

export const getCurrentUser = async (id: number): Promise<PublicUser> => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new HttpError(404, 'Usuario no encontrado');
  }
  return sanitizeUser(user);
};