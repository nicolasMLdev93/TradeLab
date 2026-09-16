import { type Request, type Response, type NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) return next();

  return res.status(400).json({
    ok: false,
    message: 'Errores de validación',
    errors: errors.array().map((e) => ({
      field: e.type === 'field' ? e.path : undefined,
      message: e.msg,
    })),
  });
};