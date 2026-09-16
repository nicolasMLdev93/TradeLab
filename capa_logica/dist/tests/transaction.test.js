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
const wallet_model_1 = require("../src/models/wallet.model");
describe('Transaction endpoints', () => {
    let walletId;
    let accessToken;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, db_helper_1.truncateAll)();
        const currency = yield currency_model_1.Currency.create({
            symbol: 'BTC',
            name: 'Bitcoin',
            type: 'crypto',
            decimals: 8,
        });
        const auth = yield (0, auth_helper_1.createUserAndGetToken)();
        accessToken = auth.accessToken;
        const wallet = yield wallet_model_1.Wallet.create({
            userId: auth.user.id,
            currencyId: currency.id,
            balance: '0',
        });
        walletId = wallet.id;
    }));
    describe('POST /api/transactions', () => {
        it('crea una transacción con estado pending', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(auth_helper_1.app)
                .post('/api/transactions')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                walletId,
                type: 'buy',
                amount: '0.5',
                price: '45000.00',
                note: 'Compra inicial',
            });
            expect(res.status).toBe(201);
            expect(res.body.transaction).toMatchObject({
                walletId,
                type: 'buy',
                status: 'pending',
            });
        }));
        it('rechaza amount negativo', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(auth_helper_1.app)
                .post('/api/transactions')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ walletId, type: 'buy', amount: '-1' });
            expect(res.status).toBe(400);
        }));
    });
    describe('PATCH /api/transactions/:id/status', () => {
        it('cambia estado de pending a completed', () => __awaiter(void 0, void 0, void 0, function* () {
            const create = yield (0, supertest_1.default)(auth_helper_1.app)
                .post('/api/transactions')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ walletId, type: 'buy', amount: '0.5' });
            const res = yield (0, supertest_1.default)(auth_helper_1.app)
                .patch(`/api/transactions/${create.body.transaction.id}/status`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ status: 'completed' });
            expect(res.status).toBe(200);
            expect(res.body.transaction.status).toBe('completed');
        }));
        it('no permite cambiar estado de una ya completada', () => __awaiter(void 0, void 0, void 0, function* () {
            const create = yield (0, supertest_1.default)(auth_helper_1.app)
                .post('/api/transactions')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ walletId, type: 'buy', amount: '0.5' });
            yield (0, supertest_1.default)(auth_helper_1.app)
                .patch(`/api/transactions/${create.body.transaction.id}/status`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ status: 'completed' });
            const res = yield (0, supertest_1.default)(auth_helper_1.app)
                .patch(`/api/transactions/${create.body.transaction.id}/status`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ status: 'cancelled' });
            expect(res.status).toBe(409);
        }));
    });
    describe('GET /api/transactions', () => {
        it('filtra por status', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(auth_helper_1.app)
                .post('/api/transactions')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ walletId, type: 'buy', amount: '0.1' });
            yield (0, supertest_1.default)(auth_helper_1.app)
                .post('/api/transactions')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ walletId, type: 'sell', amount: '0.2' });
            const res = yield (0, supertest_1.default)(auth_helper_1.app)
                .get('/api/transactions?status=pending')
                .set('Authorization', `Bearer ${accessToken}`);
            expect(res.body.items).toHaveLength(2);
            expect(res.body.total).toBe(2);
        }));
    });
    describe('DELETE /api/transactions/:id', () => {
        it('permite borrar pending', () => __awaiter(void 0, void 0, void 0, function* () {
            const create = yield (0, supertest_1.default)(auth_helper_1.app)
                .post('/api/transactions')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ walletId, type: 'buy', amount: '0.5' });
            const res = yield (0, supertest_1.default)(auth_helper_1.app)
                .delete(`/api/transactions/${create.body.transaction.id}`)
                .set('Authorization', `Bearer ${accessToken}`);
            expect(res.status).toBe(200);
        }));
        it('no permite borrar completed', () => __awaiter(void 0, void 0, void 0, function* () {
            const create = yield (0, supertest_1.default)(auth_helper_1.app)
                .post('/api/transactions')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ walletId, type: 'buy', amount: '0.5' });
            yield (0, supertest_1.default)(auth_helper_1.app)
                .patch(`/api/transactions/${create.body.transaction.id}/status`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ status: 'completed' });
            const res = yield (0, supertest_1.default)(auth_helper_1.app)
                .delete(`/api/transactions/${create.body.transaction.id}`)
                .set('Authorization', `Bearer ${accessToken}`);
            expect(res.status).toBe(409);
        }));
    });
});
