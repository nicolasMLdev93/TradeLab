// src/app.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/auth.routes";
import walletRoutes from "./routes/wallet.routes";
import transactionRoutes from "./routes/transaction.routes";
import currencyRoutes from "./routes/currency.routes";
import { errorHandler, notFound } from "./middlewares/error.middleware";
import { env } from "./config/env";
import { swaggerSpec } from './config/swagger';

export const createApp = () => {
  const app = express();

  app.use(cors({ origin: env.clientUrl, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("/health", (_req, res) => {
    res.json({ ok: true, env: env.nodeEnv });
  });

  // Rutas
  app.use("/api/auth", authRoutes);
  app.use("/api/wallets", walletRoutes);
  app.use("/api/transactions", transactionRoutes);
  app.use("/api/currencies", currencyRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
