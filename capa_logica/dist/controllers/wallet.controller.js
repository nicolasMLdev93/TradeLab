"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.list = exports.create = void 0;
const wallet_service_1 = require("../services/wallet.service");
const create = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { currencyId, balance, address } = req.body;
        const wallet = await (0, wallet_service_1.createWallet)({
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
};
exports.create = create;
const list = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const wallets = await (0, wallet_service_1.listUserWallets)(userId);
        res.json({ ok: true, wallets });
    }
    catch (err) {
        next(err);
    }
};
exports.list = list;
const remove = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const walletId = Number(req.params.id);
        await (0, wallet_service_1.deleteWallet)(walletId, userId);
        res.json({ ok: true, message: 'Wallet eliminada' });
    }
    catch (err) {
        next(err);
    }
};
exports.remove = remove;
