"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransaction = exports.updateTransactionStatus = exports.getTransactionById = exports.listUserTransactions = exports.createTransaction = void 0;
const transaction_model_1 = require("../models/transaction.model");
const wallet_model_1 = require("../models/wallet.model");
const httpError_1 = require("../utils/httpError");
const createTransaction = async (input) => {
    const { userId, walletId, type, amount, price, note } = input;
    // Verifica que la wallet exista y pertenezca al usuario
    const wallet = await wallet_model_1.Wallet.findByPk(walletId);
    if (!wallet) {
        throw new httpError_1.HttpError(404, 'Wallet no encontrada');
    }
    if (wallet.userId !== userId) {
        throw new httpError_1.HttpError(403, 'No autorizado sobre esta wallet');
    }
    const transaction = await transaction_model_1.Transaction.create({
        userId,
        walletId,
        type,
        amount,
        price: price ?? null,
        note: note ?? null,
        status: 'pending',
    });
    return transaction;
};
exports.createTransaction = createTransaction;
const listUserTransactions = async (userId, filters = {}) => {
    const { status, type, walletId, limit = 20, offset = 0 } = filters;
    const where = { userId };
    if (status)
        where['status'] = status;
    if (type)
        where['type'] = type;
    if (walletId)
        where['walletId'] = walletId;
    const { rows, count } = await transaction_model_1.Transaction.findAndCountAll({
        where,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
    });
    return { items: rows, total: count, limit, offset };
};
exports.listUserTransactions = listUserTransactions;
const getTransactionById = async (id, userId) => {
    const transaction = await transaction_model_1.Transaction.findByPk(id);
    if (!transaction) {
        throw new httpError_1.HttpError(404, 'Transacción no encontrada');
    }
    if (transaction.userId !== userId) {
        throw new httpError_1.HttpError(403, 'No autorizado');
    }
    return transaction;
};
exports.getTransactionById = getTransactionById;
const updateTransactionStatus = async (id, userId, status) => {
    const transaction = await (0, exports.getTransactionById)(id, userId);
    if (transaction.status !== 'pending') {
        throw new httpError_1.HttpError(409, 'Solo se pueden modificar transacciones pendientes');
    }
    transaction.status = status;
    await transaction.save();
    return transaction;
};
exports.updateTransactionStatus = updateTransactionStatus;
const deleteTransaction = async (id, userId) => {
    const transaction = await (0, exports.getTransactionById)(id, userId);
    if (!['pending', 'cancelled'].includes(transaction.status)) {
        throw new httpError_1.HttpError(409, `No se puede eliminar una transacción en estado "${transaction.status}"`);
    }
    await transaction.destroy();
};
exports.deleteTransaction = deleteTransaction;
