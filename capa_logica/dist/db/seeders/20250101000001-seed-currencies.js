"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(queryInterface) {
    const now = new Date();
    const currencies = [
        { symbol: 'USD', name: 'US Dollar', type: 'fiat', decimals: 2 },
        { symbol: 'USDT', name: 'Tether', type: 'crypto', decimals: 6 },
        { symbol: 'BTC', name: 'Bitcoin', type: 'crypto', decimals: 8 },
        { symbol: 'ETH', name: 'Ethereum', type: 'crypto', decimals: 8 },
        { symbol: 'SOL', name: 'Solana', type: 'crypto', decimals: 8 },
    ];
    await queryInterface.bulkInsert('currencies', currencies.map((c) => ({
        ...c,
        created_at: now,
        updated_at: now,
    })));
}
async function down(queryInterface) {
    await queryInterface.bulkDelete('currencies', {
        symbol: ['USD', 'USDT', 'BTC', 'ETH', 'SOL'],
    });
}
