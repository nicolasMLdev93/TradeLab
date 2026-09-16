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
exports.deleteTransaction = exports.updateTransactionStatus = exports.getTransactionById = exports.listUserTransactions = exports.createTransaction = void 0;
const transaction_model_1 = require("../models/transaction.model");
const wallet_model_1 = require("../models/wallet.model");
const httpError_1 = require("../utils/httpError");
const createTransaction = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, walletId, type, amount, price, note } = input;
    // Verifica que la wallet exista y pertenezca al usuario
    const wallet = yield wallet_model_1.Wallet.findByPk(walletId);
    if (!wallet) {
        throw new httpError_1.HttpError(404, 'Wallet no encontrada');
    }
    if (wallet.userId !== userId) {
        throw new httpError_1.HttpError(403, 'No autorizado sobre esta wallet');
    }
    const transaction = yield transaction_model_1.Transaction.create({
        userId,
        walletId,
        type,
        amount,
        price: price !== null && price !== void 0 ? price : null,
        note: note !== null && note !== void 0 ? note : null,
        status: 'pending',
    });
    return transaction;
});
exports.createTransaction = createTransaction;
const listUserTransactions = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, filters = {}) {
    const { status, type, walletId, limit = 20, offset = 0 } = filters;
    const where = { userId };
    if (status)
        where['status'] = status;
    if (type)
        where['type'] = type;
    if (walletId)
        where['walletId'] = walletId;
    const { rows, count } = yield transaction_model_1.Transaction.findAndCountAll({
        where,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
    });
    return { items: rows, total: count, limit, offset };
});
exports.listUserTransactions = listUserTransactions;
const getTransactionById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield transaction_model_1.Transaction.findByPk(id);
    if (!transaction) {
        throw new httpError_1.HttpError(404, 'Transacción no encontrada');
    }
    if (transaction.userId !== userId) {
        throw new httpError_1.HttpError(403, 'No autorizado');
    }
    return transaction;
});
exports.getTransactionById = getTransactionById;
const updateTransactionStatus = (id, userId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield (0, exports.getTransactionById)(id, userId);
    if (transaction.status !== 'pending') {
        throw new httpError_1.HttpError(409, 'Solo se pueden modificar transacciones pendientes');
    }
    transaction.status = status;
    yield transaction.save();
    return transaction;
});
exports.updateTransactionStatus = updateTransactionStatus;
const deleteTransaction = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield (0, exports.getTransactionById)(id, userId);
    if (!['pending', 'cancelled'].includes(transaction.status)) {
        throw new httpError_1.HttpError(409, `No se puede eliminar una transacción en estado "${transaction.status}"`);
    }
    yield transaction.destroy();
});
exports.deleteTransaction = deleteTransaction;
