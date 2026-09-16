"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
/**
 * Middleware de autorización por roles.
 * Uso: router.post('/', authenticate, authorize('admin'), handler)
 */
const authorize = (...allowedRoles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            ok: false,
            message: 'No autenticado',
        });
    }
    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
            ok: false,
            message: `No autorizado. Se requiere rol: ${allowedRoles.join(' o ')}`,
        });
    }
    next();
};
exports.authorize = authorize;
