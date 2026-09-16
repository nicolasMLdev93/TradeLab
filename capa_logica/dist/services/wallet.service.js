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
exports.deleteWallet = exports.listUserWallets = exports.createWallet = void 0;
const wallet_model_1 = require("../models/wallet.model");
const httpError_1 = require("../utils/httpError");
const createWallet = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, currencyId, balance, address } = input;
    const existing = yield wallet_model_1.Wallet.findOne({
        where: { userId, currencyId },
    });
    if (existing) {
        throw new httpError_1.HttpError(409, 'Ya tienes una wallet de esa moneda');
    }
    const wallet = yield wallet_model_1.Wallet.create({
        userId,
        currencyId,
        balance: balance !== null && balance !== void 0 ? balance : '0',
        address: address !== null && address !== void 0 ? address : null,
    });
    return wallet;
});
exports.createWallet = createWallet;
const listUserWallets = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return wallet_model_1.Wallet.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
    });
});
exports.listUserWallets = listUserWallets;
const deleteWallet = (walletId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findByPk(walletId);
    if (!wallet) {
        throw new httpError_1.HttpError(404, 'Wallet no encontrada');
    }
    if (wallet.userId !== userId) {
        throw new httpError_1.HttpError(403, 'No autorizado para eliminar esta wallet');
    }
    yield wallet.destroy();
});
exports.deleteWallet = deleteWallet;
