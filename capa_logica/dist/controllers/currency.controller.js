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
exports.remove = exports.update = exports.getBySymbol = exports.getOne = exports.list = exports.create = void 0;
const currency_service_1 = require("../services/currency.service");
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { symbol, name, type, decimals } = req.body;
        const currency = yield (0, currency_service_1.createCurrency)({
            symbol: symbol.toUpperCase(),
            name,
            type,
            decimals: Number(decimals),
        });
        res.status(201).json({ ok: true, currency });
    }
    catch (err) {
        next(err);
    }
});
exports.create = create;
const list = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.query;
        const currencies = yield (0, currency_service_1.listCurrencies)({ type });
        res.json({ ok: true, currencies });
    }
    catch (err) {
        next(err);
    }
});
exports.list = list;
const getOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const currency = yield (0, currency_service_1.getCurrencyById)(id);
        res.json({ ok: true, currency });
    }
    catch (err) {
        next(err);
    }
});
exports.getOne = getOne;
const getBySymbol = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const symbol = String(req.params.symbol);
        const currency = yield (0, currency_service_1.getCurrencyBySymbol)(symbol);
        res.json({ ok: true, currency });
    }
    catch (err) {
        next(err);
    }
});
exports.getBySymbol = getBySymbol;
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const { name, decimals } = req.body;
        const currency = yield (0, currency_service_1.updateCurrency)(id, {
            name,
            decimals: decimals !== undefined ? Number(decimals) : undefined,
        });
        res.json({ ok: true, currency });
    }
    catch (err) {
        next(err);
    }
});
exports.update = update;
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        yield (0, currency_service_1.deleteCurrency)(id);
        res.json({ ok: true, message: 'Moneda eliminada' });
    }
    catch (err) {
        next(err);
    }
});
exports.remove = remove;
