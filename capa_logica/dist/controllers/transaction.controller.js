"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transfer = exports.remove = exports.updateStatus = exports.getOne = exports.list = exports.create = void 0;
const transaction_service_1 = require("../services/transaction.service");
const create = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { walletId, type, amount, price, note } = req.body;
        const transaction = await (0, transaction_service_1.createTransaction)({
            userId,
            walletId: Number(walletId),
            type,
            amount,
            price,
            note,
        });
        res.status(201).json({ ok: true, transaction });
    }
    catch (err) {
        next(err);
    }
};
exports.create = create;
const list = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { status, type, walletId, limit, offset } = req.query;
        const result = await (0, transaction_service_1.listUserTransactions)(userId, {
            status: status,
            type: type,
            walletId: walletId ? Number(walletId) : undefined,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
        });
        res.json({ ok: true, ...result });
    }
    catch (err) {
        next(err);
    }
};
exports.list = list;
const getOne = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const id = Number(req.params.id);
        const transaction = await (0, transaction_service_1.getTransactionById)(id, userId);
        res.json({ ok: true, transaction });
    }
    catch (err) {
        next(err);
    }
};
exports.getOne = getOne;
const updateStatus = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const id = Number(req.params.id);
        const { status } = req.body;
        const transaction = await (0, transaction_service_1.updateTransactionStatus)(id, userId, status);
        res.json({ ok: true, transaction });
    }
    catch (err) {
        next(err);
    }
};
exports.updateStatus = updateStatus;
const remove = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const id = Number(req.params.id);
        await (0, transaction_service_1.deleteTransaction)(id, userId);
        res.json({ ok: true, message: "Transacción eliminada" });
    }
    catch (err) {
        next(err);
    }
};
exports.remove = remove;
const transaction_service_2 = require("../services/transaction.service");
const transfer = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { fromWalletId, toWalletId, amount, note } = req.body;
        const result = await (0, transaction_service_2.transferBetweenWallets)({
            userId,
            fromWalletId: Number(fromWalletId),
            toWalletId: Number(toWalletId),
            amount,
            note,
        });
        res.status(201).json({
            ok: true,
            message: "Transferencia realizada",
            transfer: result,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.transfer = transfer;
