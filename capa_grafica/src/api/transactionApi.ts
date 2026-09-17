import axiosClient from './axiosClient';

export type TransactionType =
  | 'buy'
  | 'sell'
  | 'deposit'
  | 'withdrawal'
  | 'transfer_in'
  | 'transfer_out';

export type TransactionStatus =
  | 'pending'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface Transaction {
  id: number;
  userId: number;
  walletId: number;
  type: TransactionType;
  amount: string;
  price: string | null;
  status: TransactionStatus;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionListParams {
  status?: TransactionStatus;
  type?: TransactionType;
  walletId?: number;
  limit?: number;
  offset?: number;
}

export interface TransactionListResponse {
  ok: boolean;
  items: Transaction[];
  total: number;
  limit: number;
  offset: number;
}

export const getTransactions = async (
  params: TransactionListParams = {}
): Promise<TransactionListResponse> => {
  const { data } = await axiosClient.get<TransactionListResponse>(
    '/transactions',
    { params }
  );
  return data;
};

export const depositToWallet = async (payload: {
  walletId: number;
  amount: string;
  note?: string;
}): Promise<Transaction> => {
  const { data } = await axiosClient.post<{
    ok: boolean;
    transaction: Transaction;
  }>('/transactions', {
    walletId: payload.walletId,
    type: 'deposit',
    amount: payload.amount,
    note: payload.note,
  });
  return data.transaction;
};

export const transferBetweenWallets = async (payload: {
  fromWalletId: number;
  toWalletId: number;
  amount: string;
  note?: string;
}): Promise<void> => {
  await axiosClient.post('/transactions/transfer', payload);
};