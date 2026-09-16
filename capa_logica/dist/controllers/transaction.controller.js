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
exports.remove = exports.updateStatus = exports.getOne = exports.list = exports.create = void 0;
const transaction_service_1 = require("../services/transaction.service");
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { walletId, type, amount, price, note } = req.body;
        const transaction = yield (0, transaction_service_1.createTransaction)({
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
});
exports.create = create;
const list = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { status, type, walletId, limit, offset } = req.query;
        const result = yield (0, transaction_service_1.listUserTransactions)(userId, {
            status: status,
            type: type,
            walletId: walletId ? Number(walletId) : undefined,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
        });
        res.json(Object.assign({ ok: true }, result));
    }
    catch (err) {
        next(err);
    }
});
exports.list = list;
const getOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const id = Number(req.params.id);
        const transaction = yield (0, transaction_service_1.getTransactionById)(id, userId);
        res.json({ ok: true, transaction });
    }
    catch (err) {
        next(err);
    }
});
exports.getOne = getOne;
const updateStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const id = Number(req.params.id);
        const { status } = req.body;
        const transaction = yield (0, transaction_service_1.updateTransactionStatus)(id, userId, status);
        res.json({ ok: true, transaction });
    }
    catch (err) {
        next(err);
    }
});
exports.updateStatus = updateStatus;
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const id = Number(req.params.id);
        yield (0, transaction_service_1.deleteTransaction)(id, userId);
        res.json({ ok: true, message: 'Transacción eliminada' });
    }
    catch (err) {
        next(err);
    }
});
exports.remove = remove;
