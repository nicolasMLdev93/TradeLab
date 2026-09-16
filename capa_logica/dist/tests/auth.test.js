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
const supertest_1 = __importDefault(require("supertest"));
const auth_helper_1 = require("./auth.helper");
const db_helper_1 = require("./db.helper");
describe('Auth endpoints', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, db_helper_1.truncateAll)();
    }));
    describe('POST /api/auth/register', () => {
        it('registra un usuario correctamente', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(auth_helper_1.app).post('/api/auth/register').send({
                username: 'juanperez',
                email: 'juan@example.com',
                password: 'Password123',
                confirmPassword: 'Password123',
            });
            expect(res.status).toBe(201);
            expect(res.body.ok).toBe(true);
            expect(res.body.user).toMatchObject({
                username: 'juanperez',
                email: 'juan@example.com',
                role: 'user',
            });
            expect(res.body.user).not.toHaveProperty('passwordHash');
            expect(res.body.accessToken).toBeDefined();
            expect(res.headers['set-cookie']).toBeDefined();
        }));
        it('rechaza si el email ya existe', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                username: 'juanperez',
                email: 'juan@example.com',
                password: 'Password123',
                confirmPassword: 'Password123',
            };
            yield (0, supertest_1.default)(auth_helper_1.app).post('/api/auth/register').send(payload);
            const res = yield (0, supertest_1.default)(auth_helper_1.app).post('/api/auth/register').send(payload);
            expect(res.status).toBe(409);
            expect(res.body.ok).toBe(false);
        }));
        it('rechaza password débil', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(auth_helper_1.app).post('/api/auth/register').send({
                username: 'juan',
                email: 'juan@example.com',
                password: 'debil',
                confirmPassword: 'debil',
            });
            expect(res.status).toBe(400);
            expect(res.body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'password' })]));
        }));
        it('rechaza si las contraseñas no coinciden', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(auth_helper_1.app).post('/api/auth/register').send({
                username: 'juan',
                email: 'juan@example.com',
                password: 'Password123',
                confirmPassword: 'Different123',
            });
            expect(res.status).toBe(400);
        }));
    });
    describe('POST /api/auth/login', () => {
        const user = {
            username: 'juan',
            email: 'juan@example.com',
            password: 'Password123',
        };
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(auth_helper_1.app).post('/api/auth/register').send(Object.assign(Object.assign({}, user), { confirmPassword: user.password }));
        }));
        it('loguea con credenciales válidas', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(auth_helper_1.app)
                .post('/api/auth/login')
                .send({ email: user.email, password: user.password });
            expect(res.status).toBe(200);
            expect(res.body.ok).toBe(true);
            expect(res.body.accessToken).toBeDefined();
            expect(res.body.user.email).toBe(user.email);
        }));
        it('rechaza password incorrecta', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(auth_helper_1.app)
                .post('/api/auth/login')
                .send({ email: user.email, password: 'WrongPassword123' });
            expect(res.status).toBe(401);
        }));
        it('rechaza email inexistente', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(auth_helper_1.app)
                .post('/api/auth/login')
                .send({ email: 'noexiste@example.com', password: user.password });
            expect(res.status).toBe(401);
        }));
    });
    describe('GET /api/auth/me', () => {
        it('devuelve el usuario autenticado con token válido', () => __awaiter(void 0, void 0, void 0, function* () {
            const reg = yield (0, supertest_1.default)(auth_helper_1.app).post('/api/auth/register').send({
                username: 'juan',
                email: 'juan@example.com',
                password: 'Password123',
                confirmPassword: 'Password123',
            });
            const res = yield (0, supertest_1.default)(auth_helper_1.app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${reg.body.accessToken}`);
            expect(res.status).toBe(200);
            expect(res.body.user.email).toBe('juan@example.com');
        }));
        it('rechaza sin token', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(auth_helper_1.app).get('/api/auth/me');
            expect(res.status).toBe(401);
        }));
        it('rechaza token inválido', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(auth_helper_1.app)
                .get('/api/auth/me')
                .set('Authorization', 'Bearer token_basura');
            expect(res.status).toBe(401);
        }));
    });
});
