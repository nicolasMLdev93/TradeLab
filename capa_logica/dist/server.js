"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const index_1 = require("./index");
const database_1 = require("./config/database");
const env_1 = require("./config/env");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, database_1.connectDatabase)();
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
                server.close(() => __awaiter(this, void 0, void 0, function* () {
                    yield database_1.sequelize.close();
                    console.log('🔌 DB cerrada. Bye.');
                    process.exit(0);
                }));
            };
            process.on('SIGINT', () => shutdown('SIGINT'));
            process.on('SIGTERM', () => shutdown('SIGTERM'));
        }
        catch (error) {
            console.error('💥 Error al arrancar:', error);
            process.exit(1);
        }
    });
}
bootstrap();
