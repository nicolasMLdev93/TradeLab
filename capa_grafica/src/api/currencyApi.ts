import axiosClient from './axiosClient';

export interface CurrencyWithPrice {
  id: number;
  symbol: string;
  name: string;
  type: 'fiat' | 'crypto';
  decimals: number;
  usd: number;
  change24h: number;
}

export interface PricesResponse {
  ok: boolean;
  currencies: CurrencyWithPrice[];
  lastUpdated: string;
}

export const getCurrenciesWithPrices = async (): Promise<PricesResponse> => {
  const { data } = await axiosClient.get<PricesResponse>('/currencies/prices');
  return data;
};