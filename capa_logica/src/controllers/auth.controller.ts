import { type Request, type Response, type NextFunction } from 'express';
import { env } from '../config/env';
import {
  registerUser,
  loginUser,
  refreshUserTokens,
  getCurrentUser,
} from '../services/auth.service';

const REFRESH_COOKIE = 'refreshToken';
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const setRefreshCookie = (res: Response, token: string) => {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: 'strict',
    maxAge: REFRESH_MAX_AGE,
  });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;

    const { user, accessToken, refreshToken } = await registerUser({
      username,
      email,
      password,
    });

    setRefreshCookie(res, refreshToken);

    res.status(201).json({
      ok: true,
      user,
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await loginUser({
      email,
      password,
    });

    setRefreshCookie(res, refreshToken);

    res.json({
      ok: true,
      user,
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.[REFRESH_COOKIE] as string | undefined;

    if (!token) {
      return res.status(401).json({
        ok: false,
        message: 'Refresh token no proporcionado',
      });
    }

    const { accessToken } = await refreshUserTokens(token);
    res.json({ ok: true, accessToken });
  } catch (err) {
    next(err);
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie(REFRESH_COOKIE);
  res.json({ ok: true, message: 'Sesión cerrada' });
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getCurrentUser(req.user!.id);
    res.json({ ok: true, user });
  } catch (err) {
    next(err);
  }
};