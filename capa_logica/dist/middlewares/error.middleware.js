"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = void 0;
const env_1 = require("../config/env");
const httpError_1 = require("../utils/httpError");
const notFound = (req, res) => {
    res.status(404).json({
        ok: false,
        message: `Ruta ${req.method} ${req.originalUrl} no encontrada`,
    });
};
exports.notFound = notFound;
const errorHandler = (err, _req, res, _next) => {
    const status = err instanceof httpError_1.HttpError ? err.status : 500;
    const message = err instanceof httpError_1.HttpError
        ? err.message
        : env_1.env.isProd
            ? 'Error interno del servidor'
            : err.message;
    if (!env_1.env.isProd) {
        console.error(`[${status}]`, err);
    }
    res.status(status).json({ ok: false, message });
};
exports.errorHandler = errorHandler;
