"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const schema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    PORT: zod_1.z.coerce.number().int().positive().default(3000),
    CLIENT_URL: zod_1.z.string().url().default('http://localhost:5173'),
    // Database
    DB_HOST: zod_1.z.string().min(1),
    DB_PORT: zod_1.z.coerce.number().int().positive().default(3306),
    DB_NAME: zod_1.z.string().min(1),
    DB_USER: zod_1.z.string().min(1),
    DB_PASSWORD: zod_1.z.string().min(1),
    // JWT
    JWT_SECRET: zod_1.z.string().min(32, 'JWT_SECRET debe tener al menos 32 caracteres'),
    JWT_REFRESH_SECRET: zod_1.z.string().min(32, 'JWT_REFRESH_SECRET debe tener al menos 32 caracteres'),
    JWT_EXPIRES_IN: zod_1.z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default('7d'),
    // Bcrypt
    BCRYPT_ROUNDS: zod_1.z.coerce.number().int().min(4).max(15).default(10),
});
const parsed = schema.safeParse(process.env);
if (!parsed.success) {
    console.error('❌ Variables de entorno inválidas:\n');
    console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2));
    process.exit(1);
}
exports.env = {
    isDev: parsed.data.NODE_ENV === 'development',
    isProd: parsed.data.NODE_ENV === 'production',
    isTest: parsed.data.NODE_ENV === 'test',
    nodeEnv: parsed.data.NODE_ENV,
    port: parsed.data.PORT,
    clientUrl: parsed.data.CLIENT_URL,
    db: {
        host: parsed.data.DB_HOST,
        port: parsed.data.DB_PORT,
        name: parsed.data.DB_NAME,
        user: parsed.data.DB_USER,
        password: parsed.data.DB_PASSWORD,
    },
    jwt: {
        secret: parsed.data.JWT_SECRET,
        refreshSecret: parsed.data.JWT_REFRESH_SECRET,
        expiresIn: parsed.data.JWT_EXPIRES_IN,
        refreshExpiresIn: parsed.data.JWT_REFRESH_EXPIRES_IN,
    },
    bcrypt: {
        rounds: parsed.data.BCRYPT_ROUNDS,
    },
};
