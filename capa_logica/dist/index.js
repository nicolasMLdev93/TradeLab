"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const env_1 = require("./config/env");
const createApp = () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: env_1.env.clientUrl,
        credentials: true,
    }));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
    // Health check
    app.get('/health', (_req, res) => {
        res.json({ ok: true, env: env_1.env.nodeEnv });
    });
    // Rutas
    app.use('/api/auth', auth_routes_1.default);
    // 404 + errores (siempre al final)
    app.use(error_middleware_1.notFound);
    app.use(error_middleware_1.errorHandler);
    return app;
};
exports.createApp = createApp;
