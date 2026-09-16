"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuthenticate = exports.authenticate = void 0;
const jwt_util_1 = require("../utils/jwt.util");
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
        return res.status(401).json({ ok: false, message: 'Token no proporcionado' });
    }
    const token = authHeader.split(' ')[1];
    try {
        req.user = (0, jwt_util_1.verifyAccessToken)(token);
        next();
    }
    catch (_a) {
        return res.status(401).json({ ok: false, message: 'Token inválido o expirado' });
    }
};
exports.authenticate = authenticate;
const optionalAuthenticate = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer ')))
        return next();
    try {
        req.user = (0, jwt_util_1.verifyAccessToken)(authHeader.split(' ')[1]);
    }
    catch (_a) {
        // 
    }
    next();
};
exports.optionalAuthenticate = optionalAuthenticate;
