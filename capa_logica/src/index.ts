import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import { errorHandler, notFound } from './middlewares/error.middleware';
import { env } from './config/env';

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ ok: true, env: env.nodeEnv });
  });

  // Rutas
  app.use('/api/auth', authRoutes);

  // 404 + errores (siempre al final)
  app.use(notFound);
  app.use(errorHandler);

  return app;
};