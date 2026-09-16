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
describe('Currency endpoints', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, db_helper_1.truncateAll)();
    }));
    describe('GET /api/currencies', () => {
        it('devuelve lista vacía al inicio', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(auth_helper_1.app).get('/api/currencies');
            expect(res.status).toBe(200);
            expect(res.body.currencies).toEqual([]);
        }));
    });
    describe('POST /api/currencies', () => {
        it('admin puede crear una moneda', () => __awaiter(void 0, void 0, void 0, function* () {
            const { accessToken } = yield (0, auth_helper_1.createAdminAndGetToken)();
            const res = yield (0, supertest_1.default)(auth_helper_1.app)
                .post('/api/currencies')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ symbol: 'BTC', name: 'Bitcoin', type: 'crypto', decimals: 8 });
            expect(res.status).toBe(201);
            expect(res.body.currency.symbol).toBe('BTC');
        }));
        it('usuario normal recibe 403', () => __awaiter(void 0, void 0, void 0, function* () {
            const { accessToken } = yield (0, auth_helper_1.createUserAndGetToken)();
            const res = yield (0, supertest_1.default)(auth_helper_1.app)
                .post('/api/currencies')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ symbol: 'BTC', name: 'Bitcoin', type: 'crypto', decimals: 8 });
            expect(res.status).toBe(403);
        }));
        it('rechaza símbolo duplicado', () => __awaiter(void 0, void 0, void 0, function* () {
            const { accessToken } = yield (0, auth_helper_1.createAdminAndGetToken)();
            yield (0, supertest_1.default)(auth_helper_1.app)
                .post('/api/currencies')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ symbol: 'BTC', name: 'Bitcoin', type: 'crypto', decimals: 8 });
            const res = yield (0, supertest_1.default)(auth_helper_1.app)
                .post('/api/currencies')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ symbol: 'BTC', name: 'Bitcoin 2', type: 'crypto', decimals: 8 });
            expect(res.status).toBe(409);
        }));
    });
    describe('GET /api/currencies/symbol/:symbol', () => {
        it('encuentra por símbolo', () => __awaiter(void 0, void 0, void 0, function* () {
            const { accessToken } = yield (0, auth_helper_1.createAdminAndGetToken)();
            yield (0, supertest_1.default)(auth_helper_1.app)
                .post('/api/currencies')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ symbol: 'ETH', name: 'Ethereum', type: 'crypto', decimals: 18 });
            const res = yield (0, supertest_1.default)(auth_helper_1.app).get('/api/currencies/symbol/ETH');
            expect(res.status).toBe(200);
            expect(res.body.currency.name).toBe('Ethereum');
        }));
        it('404 si no existe', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(auth_helper_1.app).get('/api/currencies/symbol/XYZ');
            expect(res.status).toBe(404);
        }));
    });
});
