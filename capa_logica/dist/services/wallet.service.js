"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWallet = exports.listUserWallets = exports.createWallet = void 0;
const wallet_model_1 = require("../models/wallet.model");
const httpError_1 = require("../utils/httpError");
const createWallet = async (input) => {
    const { userId, currencyId, balance, address } = input;
    const existing = await wallet_model_1.Wallet.findOne({
        where: { userId, currencyId },
    });
    if (existing) {
        throw new httpError_1.HttpError(409, 'Ya tienes una wallet de esa moneda');
    }
    const wallet = await wallet_model_1.Wallet.create({
        userId,
        currencyId,
        balance: balance ?? '0',
        address: address ?? null,
    });
    return wallet;
};
exports.createWallet = createWallet;
const listUserWallets = async (userId) => {
    return wallet_model_1.Wallet.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
    });
};
exports.listUserWallets = listUserWallets;
const deleteWallet = async (walletId, userId) => {
    const wallet = await wallet_model_1.Wallet.findByPk(walletId);
    if (!wallet) {
        throw new httpError_1.HttpError(404, 'Wallet no encontrada');
    }
    if (wallet.userId !== userId) {
        throw new httpError_1.HttpError(403, 'No autorizado para eliminar esta wallet');
    }
    await wallet.destroy();
};
exports.deleteWallet = deleteWallet;
