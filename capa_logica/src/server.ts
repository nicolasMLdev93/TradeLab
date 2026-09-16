import 'reflect-metadata';
import { createApp } from './index';
import { connectDatabase, sequelize } from './config/database';
import { env } from './config/env';

async function bootstrap() {
  try {
    await connectDatabase();
    console.log('✅ Conexión a MySQL OK');

    const app = createApp();

    const server = app.listen(env.port, () => {
      console.log(`🚀 Server running on http://localhost:${env.port} [${env.nodeEnv}]`);
    });

    server.on('error', (error) => {
      console.error('✗ Failed to start server:', error);
      process.exit(1);
    });

    const shutdown = (signal: string) => {
      console.log(`\n${signal} recibido, cerrando...`);
      server.close(async () => {
        await sequelize.close();
        console.log('🔌 DB cerrada. Bye.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('💥 Error al arrancar:', error);
    process.exit(1);
  }
}

bootstrap();