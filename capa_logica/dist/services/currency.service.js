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
exports.deleteCurrency = exports.updateCurrency = exports.getCurrencyBySymbol = exports.getCurrencyById = exports.listCurrencies = exports.createCurrency = void 0;
const currency_model_1 = require("../models/currency.model");
const httpError_1 = require("../utils/httpError");
const createCurrency = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { symbol, name, type, decimals } = input;
    const existing = yield currency_model_1.Currency.findOne({ where: { symbol } });
    if (existing) {
        throw new httpError_1.HttpError(409, 'Ya existe una moneda con ese símbolo');
    }
    const currency = yield currency_model_1.Currency.create({
        symbol,
        name,
        type,
        decimals,
    });
    return currency;
});
exports.createCurrency = createCurrency;
const listCurrencies = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filters = {}) {
    const where = {};
    if (filters.type)
        where['type'] = filters.type;
    return currency_model_1.Currency.findAll({
        where,
        order: [['symbol', 'ASC']],
    });
});
exports.listCurrencies = listCurrencies;
const getCurrencyById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const currency = yield currency_model_1.Currency.findByPk(id);
    if (!currency) {
        throw new httpError_1.HttpError(404, 'Moneda no encontrada');
    }
    return currency;
});
exports.getCurrencyById = getCurrencyById;
const getCurrencyBySymbol = (symbol) => __awaiter(void 0, void 0, void 0, function* () {
    const currency = yield currency_model_1.Currency.findOne({
        where: { symbol: symbol.toUpperCase() },
    });
    if (!currency) {
        throw new httpError_1.HttpError(404, 'Moneda no encontrada');
    }
    return currency;
});
exports.getCurrencyBySymbol = getCurrencyBySymbol;
const updateCurrency = (id, input) => __awaiter(void 0, void 0, void 0, function* () {
    const currency = yield (0, exports.getCurrencyById)(id);
    if (input.name !== undefined)
        currency.name = input.name;
    if (input.decimals !== undefined)
        currency.decimals = input.decimals;
    yield currency.save();
    return currency;
});
exports.updateCurrency = updateCurrency;
const deleteCurrency = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const currency = yield (0, exports.getCurrencyById)(id);
    yield currency.destroy();
});
exports.deleteCurrency = deleteCurrency;
