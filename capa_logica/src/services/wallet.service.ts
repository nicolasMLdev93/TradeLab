import { Wallet } from '../models/wallet.model';
import { HttpError } from '../utils/httpError';

export const createWallet = async (input: {
  userId: number;
  currencyId: number;
  balance?: string;
  address?: string | null;
}) => {
  const { userId, currencyId, balance, address } = input;

  const existing = await Wallet.findOne({
    where: { userId, currencyId },
  });
  if (existing) {
    throw new HttpError(409, 'Ya tienes una wallet de esa moneda');
  }

  const wallet = await Wallet.create({
    userId,
    currencyId,
    balance: balance ?? '0',
    address: address ?? null,
  });

  return wallet;
};

export const listUserWallets = async (userId: number) => {
  return Wallet.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
  });
};

export const deleteWallet = async (walletId: number, userId: number) => {
  const wallet = await Wallet.findByPk(walletId);

  if (!wallet) {
    throw new HttpError(404, 'Wallet no encontrada');
  }

  if (wallet.userId !== userId) {
    throw new HttpError(403, 'No autorizado para eliminar esta wallet');
  }

  await wallet.destroy();
};