import { type Request, type Response, type NextFunction } from 'express';
import { env } from '../config/env';
import { HttpError } from '../utils/httpError';

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    ok: false,
    message: `Ruta ${req.method} ${req.originalUrl} no encontrada`,
  });
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err instanceof HttpError ? err.status : 500;

  const message =
    err instanceof HttpError
      ? err.message
      : env.isProd
        ? 'Error interno del servidor'
        : err.message;

  if (!env.isProd) {
    console.error(`[${status}]`, err);
  }

  res.status(status).json({ ok: false, message });
};