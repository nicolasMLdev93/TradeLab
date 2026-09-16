"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCurrency = exports.updateCurrency = exports.getCurrencyBySymbol = exports.getCurrencyById = exports.listCurrencies = exports.createCurrency = void 0;
const currency_model_1 = require("../models/currency.model");
const httpError_1 = require("../utils/httpError");
const createCurrency = async (input) => {
    const { symbol, name, type, decimals } = input;
    const existing = await currency_model_1.Currency.findOne({ where: { symbol } });
    if (existing) {
        throw new httpError_1.HttpError(409, 'Ya existe una moneda con ese símbolo');
    }
    const currency = await currency_model_1.Currency.create({
        symbol,
        name,
        type,
        decimals,
    });
    return currency;
};
exports.createCurrency = createCurrency;
const listCurrencies = async (filters = {}) => {
    const where = {};
    if (filters.type)
        where['type'] = filters.type;
    return currency_model_1.Currency.findAll({
        where,
        order: [['symbol', 'ASC']],
    });
};
exports.listCurrencies = listCurrencies;
const getCurrencyById = async (id) => {
    const currency = await currency_model_1.Currency.findByPk(id);
    if (!currency) {
        throw new httpError_1.HttpError(404, 'Moneda no encontrada');
    }
    return currency;
};
exports.getCurrencyById = getCurrencyById;
const getCurrencyBySymbol = async (symbol) => {
    const currency = await currency_model_1.Currency.findOne({
        where: { symbol: symbol.toUpperCase() },
    });
    if (!currency) {
        throw new httpError_1.HttpError(404, 'Moneda no encontrada');
    }
    return currency;
};
exports.getCurrencyBySymbol = getCurrencyBySymbol;
const updateCurrency = async (id, input) => {
    const currency = await (0, exports.getCurrencyById)(id);
    if (input.name !== undefined)
        currency.name = input.name;
    if (input.decimals !== undefined)
        currency.decimals = input.decimals;
    await currency.save();
    return currency;
};
exports.updateCurrency = updateCurrency;
const deleteCurrency = async (id) => {
    const currency = await (0, exports.getCurrencyById)(id);
    await currency.destroy();
};
exports.deleteCurrency = deleteCurrency;
