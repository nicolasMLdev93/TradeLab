import { type Request, type Response, type NextFunction } from 'express';

export type Role = 'user' | 'admin';

/**
 * Middleware de autorización por roles.
 * Uso: router.post('/', authenticate, authorize('admin'), handler)
 */
export const authorize = (...allowedRoles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        ok: false,
        message: 'No autenticado',
      });
    }

    if (!allowedRoles.includes(req.user.role as Role)) {
      return res.status(403).json({
        ok: false,
        message: `No autorizado. Se requiere rol: ${allowedRoles.join(' o ')}`,
      });
    }

    next();
  };