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
exports.remove = exports.list = exports.create = void 0;
const wallet_service_1 = require("../services/wallet.service");
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { currencyId, balance, address } = req.body;
        const wallet = yield (0, wallet_service_1.createWallet)({
            userId,
            currencyId: Number(currencyId),
            balance,
            address,
        });
        res.status(201).json({ ok: true, wallet });
    }
    catch (err) {
        next(err);
    }
});
exports.create = create;
const list = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const wallets = yield (0, wallet_service_1.listUserWallets)(userId);
        res.json({ ok: true, wallets });
    }
    catch (err) {
        next(err);
    }
});
exports.list = list;
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const walletId = Number(req.params.id);
        yield (0, wallet_service_1.deleteWallet)(walletId, userId);
        res.json({ ok: true, message: 'Wallet eliminada' });
    }
    catch (err) {
        next(err);
    }
});
exports.remove = remove;
