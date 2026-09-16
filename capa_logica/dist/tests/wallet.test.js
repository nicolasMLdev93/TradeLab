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
const currency_model_1 = require("../src/models/currency.model");
describe('Wallet endpoints', () => {
    let currencyId;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, db_helper_1.truncateAll)();
        const currency = yield currency_model_1.Currency.create({
            symbol: 'BTC',
            name: 'Bitcoin',
            type: 'crypto',
            decimals: 8,
        });
        currencyId = currency.id;
    }));
    describe('POST /api/wallets', () => {
        it('crea una wallet para el usuario autenticado', () => __awaiter(void 0, void 0, void 0, function* () {
            const { accessToken } = yield (0, auth_helper_1.createUserAndGetToken)();
            const res = yield (0, supertest_1.default)(auth_helper_1.app)
                .post('/api/wallets')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ currencyId, address: '0xabc123' });
            expect(res.status).toBe(201);
            expect(res.body.wallet).toMatchObject({
                currencyId,
                address: '0xabc123',
            });
            expect(res.body.wallet.userId).toBeDefined();
        }));
        it('rechaza moneda duplicada para el mismo usuario', () => __awaiter(void 0, void 0, void 0, function* () {
            const { accessToken } = yield (0, auth_helper_1.createUserAndGetToken)();
            yield (0, supertest_1.default)(auth_helper_1.app)
                .post('/api/wallets')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ currencyId });
            const res = yield (0, supertest_1.default)(auth_helper_1.app)
                .post('/api/wallets')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ currencyId });
            expect(res.status).toBe(409);
        }));
        it('rechaza sin autenticación', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(auth_helper_1.app).post('/api/wallets').send({ currencyId });
            expect(res.status).toBe(401);
        }));
    });
    describe('GET /api/wallets', () => {
        it('lista solo las wallets del usuario', () => __awaiter(void 0, void 0, void 0, function* () {
            const { accessToken: token1 } = yield (0, auth_helper_1.createUserAndGetToken)({
                email: 'u1@test.com',
            });
            const { accessToken: token2 } = yield (0, auth_helper_1.createUserAndGetToken)({
                email: 'u2@test.com',
                username: 'u2',
            });
            yield (0, supertest_1.default)(auth_helper_1.app)
                .post('/api/wallets')
                .set('Authorization', `Bearer ${token1}`)
                .send({ currencyId });
            const res1 = yield (0, supertest_1.default)(auth_helper_1.app)
                .get('/api/wallets')
                .set('Authorization', `Bearer ${token1}`);
            const res2 = yield (0, supertest_1.default)(auth_helper_1.app)
                .get('/api/wallets')
                .set('Authorization', `Bearer ${token2}`);
            expect(res1.body.wallets).toHaveLength(1);
            expect(res2.body.wallets).toHaveLength(0);
        }));
    });
    describe('DELETE /api/wallets/:id', () => {
        it('elimina una wallet propia', () => __awaiter(void 0, void 0, void 0, function* () {
            const { accessToken } = yield (0, auth_helper_1.createUserAndGetToken)();
            const create = yield (0, supertest_1.default)(auth_helper_1.app)
                .post('/api/wallets')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ currencyId });
            const res = yield (0, supertest_1.default)(auth_helper_1.app)
                .delete(`/api/wallets/${create.body.wallet.id}`)
                .set('Authorization', `Bearer ${accessToken}`);
            expect(res.status).toBe(200);
        }));
        it('no permite borrar wallet ajena', () => __awaiter(void 0, void 0, void 0, function* () {
            const { accessToken: token1 } = yield (0, auth_helper_1.createUserAndGetToken)({
                email: 'u1@test.com',
            });
            const { accessToken: token2 } = yield (0, auth_helper_1.createUserAndGetToken)({
                email: 'u2@test.com',
                username: 'u2',
            });
            const create = yield (0, supertest_1.default)(auth_helper_1.app)
                .post('/api/wallets')
                .set('Authorization', `Bearer ${token1}`)
                .send({ currencyId });
            const res = yield (0, supertest_1.default)(auth_helper_1.app)
                .delete(`/api/wallets/${create.body.wallet.id}`)
                .set('Authorization', `Bearer ${token2}`);
            expect(res.status).toBe(403);
        }));
    });
});
