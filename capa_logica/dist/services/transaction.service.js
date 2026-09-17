"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferBetweenWallets = exports.deleteTransaction = exports.updateTransactionStatus = exports.getTransactionById = exports.listUserTransactions = exports.createTransaction = void 0;
const database_1 = require("../config/database");
const transaction_model_1 = require("../models/transaction.model");
const wallet_model_1 = require("../models/wallet.model");
const currency_model_1 = require("../models/currency.model");
const httpError_1 = require("../utils/httpError");
const INCOMING_TYPES = ['deposit', 'buy', 'transfer_in'];
const createTransaction = async (input) => {
    return database_1.sequelize.transaction(async (t) => {
        const wallet = await wallet_model_1.Wallet.findByPk(input.walletId, {
            transaction: t,
            lock: t.LOCK.UPDATE,
        });
        if (!wallet) {
            throw new httpError_1.HttpError(404, 'Wallet no encontrada');
        }
        if (wallet.userId !== input.userId) {
            throw new httpError_1.HttpError(403, 'No autorizado sobre esta wallet');
        }
        const currentBalance = Number(wallet.balance);
        const amount = Number(input.amount);
        const isIncoming = INCOMING_TYPES.includes(input.type);
        if (!isIncoming && currentBalance < amount) {
            throw new httpError_1.HttpError(400, 'Fondos insuficientes');
        }
        const newBalance = isIncoming
            ? currentBalance + amount
            : currentBalance - amount;
        await wallet.update({ balance: String(newBalance) }, { transaction: t });
        return transaction_model_1.Transaction.create({
            userId: input.userId,
            walletId: input.walletId,
            type: input.type,
            amount: input.amount,
            price: input.price ?? null,
            note: input.note ?? null,
            status: 'completed',
        }, { transaction: t });
    });
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
const transferBetweenWallets = async (input) => {
    const { userId, fromWalletId, toWalletId, amount, note } = input;
    if (fromWalletId === toWalletId) {
        throw new httpError_1.HttpError(400, 'No puedes transferir a la misma wallet');
    }
    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
        throw new httpError_1.HttpError(400, 'El monto debe ser mayor a 0');
    }
    return database_1.sequelize.transaction(async (t) => {
        const fromWallet = await wallet_model_1.Wallet.findByPk(fromWalletId, {
            transaction: t,
            lock: t.LOCK.UPDATE,
            include: [{ model: currency_model_1.Currency, as: 'currency' }],
        });
        const toWallet = await wallet_model_1.Wallet.findByPk(toWalletId, {
            transaction: t,
            lock: t.LOCK.UPDATE,
            include: [{ model: currency_model_1.Currency, as: 'currency' }],
        });
        if (!fromWallet)
            throw new httpError_1.HttpError(404, 'Wallet origen no encontrada');
        if (!toWallet)
            throw new httpError_1.HttpError(404, 'Wallet destino no encontrada');
        if (fromWallet.userId !== userId) {
            throw new httpError_1.HttpError(403, 'No autorizado sobre la wallet origen');
        }
        if (toWallet.userId !== userId) {
            throw new httpError_1.HttpError(403, 'No autorizado sobre la wallet destino');
        }
        if (fromWallet.currencyId !== toWallet.currencyId) {
            throw new httpError_1.HttpError(400, 'Solo puedes transferir entre wallets de la misma moneda');
        }
        const currentBalance = Number(fromWallet.balance);
        if (currentBalance < numericAmount) {
            throw new httpError_1.HttpError(400, 'Fondos insuficientes');
        }
        await fromWallet.update({ balance: String(currentBalance - numericAmount) }, { transaction: t });
        await toWallet.update({ balance: String(Number(toWallet.balance) + numericAmount) }, { transaction: t });
        const outTx = await transaction_model_1.Transaction.create({
            userId,
            walletId: fromWalletId,
            type: 'transfer_out',
            amount,
            price: null,
            note: note ?? `Transferencia a wallet #${toWalletId}`,
            status: 'completed',
        }, { transaction: t });
        const inTx = await transaction_model_1.Transaction.create({
            userId,
            walletId: toWalletId,
            type: 'transfer_in',
            amount,
            price: null,
            note: note ?? `Transferencia desde wallet #${fromWalletId}`,
            status: 'completed',
        }, { transaction: t });
        return { from: outTx, to: inTx };
    });
};
exports.transferBetweenWallets = transferBetweenWallets;
