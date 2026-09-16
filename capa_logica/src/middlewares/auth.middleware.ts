import { type Request, type Response, type NextFunction } from 'express';
import { verifyAccessToken, type JwtPayload } from '../utils/jwt.util';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ ok: false, message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    return res.status(401).json({ ok: false, message: 'Token inválido o expirado' });
  }
};

export const optionalAuthenticate = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return next();

  try {
    req.user = verifyAccessToken(authHeader.split(' ')[1]);
  } catch {
    // 
  }
  next();
};