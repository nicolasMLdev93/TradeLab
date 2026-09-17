"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoingeckoId = exports.COINGECKO_ID_MAP = void 0;
exports.COINGECKO_ID_MAP = {
    USDT: 'tether',
    BTC: 'bitcoin',
    ETH: 'ethereum',
    SOL: 'solana',
};
const getCoingeckoId = (symbol) => {
    return exports.COINGECKO_ID_MAP[symbol.toUpperCase()] ?? null;
};
exports.getCoingeckoId = getCoingeckoId;
