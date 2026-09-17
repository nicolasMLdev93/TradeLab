import axios from 'axios';
import { getCoingeckoId } from '../utils/coingeckoIds';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

export interface CoinPrice {
  symbol: string;
  coingeckoId: string;
  usd: number;
  usd_24h_change: number;
  last_updated_at: number;
}

interface CacheEntry {
  data: CoinPrice[];
  expiresAt: number;
}

const CACHE_TTL_MS = 60_000;
const cache = new Map<string, CacheEntry>();

const FALLBACK_PRICES: Record<string, number> = {
  BTC: 65000,
  ETH: 3200,
  SOL: 145,
  USDT: 1,
};

export const getPricesBySymbols = async (
  symbols: string[]
): Promise<CoinPrice[]> => {
  const pairs = symbols
    .map((s) => ({ symbol: s.toUpperCase(), id: getCoingeckoId(s) }))
    .filter((p): p is { symbol: string; id: string } => Boolean(p.id));

  if (pairs.length === 0) return [];

  const cacheKey = pairs
    .map((p) => p.id)
    .sort()
    .join(',');

  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const ids = pairs.map((p) => p.id).join(',');

  try {
    const { data } = await axios.get<
      Record<
        string,
        { usd: number; usd_24h_change: number; last_updated_at: number }
      >
    >(`${COINGECKO_BASE}/simple/price`, {
      params: {
        ids,
        vs_currencies: 'usd',
        include_24hr_change: true,
        include_last_updated_at: true,
      },
      headers: { Accept: 'application/json' },
      timeout: 8000,
    });

    const result = pairs
      .filter((p) => data[p.id])
      .map((p) => ({
        symbol: p.symbol,
        coingeckoId: p.id,
        usd: data[p.id].usd,
        usd_24h_change: data[p.id].usd_24h_change ?? 0,
        last_updated_at: data[p.id].last_updated_at ?? 0,
      }));

    cache.set(cacheKey, {
      data: result,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return result;
  } catch (error) {
    const isAxiosError = axios.isAxiosError(error);
    const status = isAxiosError ? error.response?.status : undefined;

    if (status === 429) {
      console.warn(
        '[crypto] CoinGecko rate limit alcanzado, usando fallback'
      );
    } else {
      console.warn('[crypto] Error consultando CoinGecko:', error);
    }

    return pairs.map((p) => ({
      symbol: p.symbol,
      coingeckoId: p.id,
      usd: FALLBACK_PRICES[p.symbol] ?? 0,
      usd_24h_change: 0,
      last_updated_at: Math.floor(Date.now() / 1000),
    }));
  }
};