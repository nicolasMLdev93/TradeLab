"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const index_1 = require("./index");
const database_1 = require("./config/database");
const env_1 = require("./config/env");
async function bootstrap() {
    try {
        await (0, database_1.connectDatabase)();
        console.log('✅ Conexión a MySQL OK');
        const app = (0, index_1.createApp)();
        const server = app.listen(env_1.env.port, () => {
            console.log(`🚀 Server running on http://localhost:${env_1.env.port} [${env_1.env.nodeEnv}]`);
        });
        server.on('error', (error) => {
            console.error('✗ Failed to start server:', error);
            process.exit(1);
        });
        const shutdown = (signal) => {
            console.log(`\n${signal} recibido, cerrando...`);
            server.close(async () => {
                await database_1.sequelize.close();
                console.log('🔌 DB cerrada. Bye.');
                process.exit(0);
            });
        };
        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));
    }
    catch (error) {
        console.error('💥 Error al arrancar:', error);
        process.exit(1);
    }
}
bootstrap();
