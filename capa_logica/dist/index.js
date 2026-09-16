"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
// src/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const wallet_routes_1 = __importDefault(require("./routes/wallet.routes"));
const transaction_routes_1 = __importDefault(require("./routes/transaction.routes"));
const currency_routes_1 = __importDefault(require("./routes/currency.routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const env_1 = require("./config/env");
const swagger_1 = require("./config/swagger");
const createApp = () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({ origin: env_1.env.clientUrl, credentials: true }));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
    // Swagger UI
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
    app.get("/health", (_req, res) => {
        res.json({ ok: true, env: env_1.env.nodeEnv });
    });
    // Rutas
    app.use("/api/auth", auth_routes_1.default);
    app.use("/api/wallets", wallet_routes_1.default);
    app.use("/api/transactions", transaction_routes_1.default);
    app.use("/api/currencies", currency_routes_1.default);
    app.use(error_middleware_1.notFound);
    app.use(error_middleware_1.errorHandler);
    return app;
};
exports.createApp = createApp;
