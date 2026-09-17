import axiosClient from './axiosClient';

export interface Currency {
  id: number;
  symbol: string;
  name: string;
  type: 'fiat' | 'crypto';
  decimals: number;
}

export interface Wallet {
  id: number;
  userId: number;
  currencyId: number;
  balance: string;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  currency?: Currency;
}

export const getWallets = async (): Promise<Wallet[]> => {
  const { data } = await axiosClient.get<{ ok: boolean; wallets: Wallet[] }>(
    '/wallets'
  );
  return data.wallets;
};

export const createWallet = async (payload: {
  currencyId: number;
  address?: string;
}): Promise<Wallet> => {
  const { data } = await axiosClient.post<{ ok: boolean; wallet: Wallet }>(
    '/wallets',
    payload
  );
  return data.wallet;
};

export const deleteWallet = async (id: number): Promise<void> => {
  await axiosClient.delete(`/wallets/${id}`);
};