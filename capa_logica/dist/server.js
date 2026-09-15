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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const index_1 = __importDefault(require("./index"));
const database_1 = require("./config/database");
const PORT = Number(process.env.PORT) || 3000;
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.sequelize.authenticate();
            console.log("✅ Conexión a MySQL OK");
            const server = index_1.default.listen(PORT, () => {
                console.log(`🚀 Server running on http://localhost:${PORT}`);
            });
            server.on("error", (error) => {
                console.error("✗ Failed to start server:", error);
                process.exit(1);
            });
            const shutdown = (signal) => __awaiter(this, void 0, void 0, function* () {
                server.close(() => __awaiter(this, void 0, void 0, function* () {
                    yield database_1.sequelize.close();
                    console.log("🔌 DB cerrada. Bye.");
                    process.exit(0);
                }));
            });
            process.on("SIGINT", () => shutdown("SIGINT"));
        }
        catch (error) {
            console.error("💥 Error al arrancar:", error);
            process.exit(1);
        }
    });
}
bootstrap();
