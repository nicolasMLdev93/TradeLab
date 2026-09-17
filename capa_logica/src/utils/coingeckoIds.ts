export const COINGECKO_ID_MAP: Record<string, string> = {
  USDT: 'tether',
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
};

export const getCoingeckoId = (symbol: string): string | null => {
  return COINGECKO_ID_MAP[symbol.toUpperCase()] ?? null;
};