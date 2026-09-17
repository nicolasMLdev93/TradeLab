"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listWithPrices = exports.remove = exports.update = exports.getBySymbol = exports.getOne = exports.list = exports.create = void 0;
const currency_service_1 = require("../services/currency.service");
const crypto_service_1 = require("../services/crypto.service");
const currency_model_1 = require("../models/currency.model");
const create = async (req, res, next) => {
    try {
        const { symbol, name, type, decimals } = req.body;
        const currency = await (0, currency_service_1.createCurrency)({
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
};
exports.create = create;
const list = async (req, res, next) => {
    try {
        const { type } = req.query;
        const currencies = await (0, currency_service_1.listCurrencies)({ type });
        res.json({ ok: true, currencies });
    }
    catch (err) {
        next(err);
    }
};
exports.list = list;
const getOne = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const currency = await (0, currency_service_1.getCurrencyById)(id);
        res.json({ ok: true, currency });
    }
    catch (err) {
        next(err);
    }
};
exports.getOne = getOne;
const getBySymbol = async (req, res, next) => {
    try {
        const symbol = String(req.params.symbol);
        const currency = await (0, currency_service_1.getCurrencyBySymbol)(symbol);
        res.json({ ok: true, currency });
    }
    catch (err) {
        next(err);
    }
};
exports.getBySymbol = getBySymbol;
const update = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const { name, decimals } = req.body;
        const currency = await (0, currency_service_1.updateCurrency)(id, {
            name,
            decimals: decimals !== undefined ? Number(decimals) : undefined,
        });
        res.json({ ok: true, currency });
    }
    catch (err) {
        next(err);
    }
};
exports.update = update;
const remove = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        await (0, currency_service_1.deleteCurrency)(id);
        res.json({ ok: true, message: 'Moneda eliminada' });
    }
    catch (err) {
        next(err);
    }
};
exports.remove = remove;
const listWithPrices = async (_req, res, next) => {
    try {
        const currencies = await currency_model_1.Currency.findAll({
            order: [['symbol', 'ASC']],
        });
        const cryptoSymbols = currencies
            .filter((c) => c.type === 'crypto')
            .map((c) => c.symbol);
        const pricesList = await (0, crypto_service_1.getPricesBySymbols)(cryptoSymbols);
        const pricesBySymbol = new Map(pricesList.map((p) => [p.symbol, p]));
        const result = currencies.map((c) => {
            const symbol = c.symbol.toUpperCase();
            if (c.type === 'fiat') {
                return {
                    id: c.id,
                    symbol,
                    name: c.name,
                    type: c.type,
                    decimals: c.decimals,
                    usd: 1,
                    change24h: 0,
                };
            }
            const price = pricesBySymbol.get(symbol);
            return {
                id: c.id,
                symbol,
                name: c.name,
                type: c.type,
                decimals: c.decimals,
                usd: price?.usd ?? 0,
                change24h: price?.usd_24h_change ?? 0,
            };
        });
        res.json({
            ok: true,
            currencies: result,
            lastUpdated: new Date().toISOString(),
        });
    }
    catch (err) {
        next(err);
    }
};
exports.listWithPrices = listWithPrices;
