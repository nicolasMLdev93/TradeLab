import { type WhereOptions } from 'sequelize';
import {
  Transaction,
  type TransactionStatus,
  type TransactionType,
} from '../models/transaction.model';
import { Wallet } from '../models/wallet.model';
import { HttpError } from '../utils/httpError';

export const createTransaction = async (input: {
  userId: number;
  walletId: number;
  type: TransactionType;
  amount: string;
  price?: string | null;
  note?: string | null;
}) => {
  const { userId, walletId, type, amount, price, note } = input;

  // Verifica que la wallet exista y pertenezca al usuario
  const wallet = await Wallet.findByPk(walletId);
  if (!wallet) {
    throw new HttpError(404, 'Wallet no encontrada');
  }
  if (wallet.userId !== userId) {
    throw new HttpError(403, 'No autorizado sobre esta wallet');
  }

  const transaction = await Transaction.create({
    userId,
    walletId,
    type,
    amount,
    price: price ?? null,
    note: note ?? null,
    status: 'pending',
  });

  return transaction;
};

export const listUserTransactions = async (
  userId: number,
  filters: {
    status?: TransactionStatus;
    type?: TransactionType;
    walletId?: number;
    limit?: number;
    offset?: number;
  } = {}
) => {
  const { status, type, walletId, limit = 20, offset = 0 } = filters;

  const where: WhereOptions = { userId };
  if (status) where['status'] = status;
  if (type) where['type'] = type;
  if (walletId) where['walletId'] = walletId;

  const { rows, count } = await Transaction.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  return { items: rows, total: count, limit, offset };
};

export const getTransactionById = async (id: number, userId: number) => {
  const transaction = await Transaction.findByPk(id);

  if (!transaction) {
    throw new HttpError(404, 'Transacción no encontrada');
  }
  if (transaction.userId !== userId) {
    throw new HttpError(403, 'No autorizado');
  }

  return transaction;
};

export const updateTransactionStatus = async (
  id: number,
  userId: number,
  status: TransactionStatus
) => {
  const transaction = await getTransactionById(id, userId);

  if (transaction.status !== 'pending') {
    throw new HttpError(409, 'Solo se pueden modificar transacciones pendientes');
  }

  transaction.status = status;
  await transaction.save();

  return transaction;
};

export const deleteTransaction = async (id: number, userId: number) => {
  const transaction = await getTransactionById(id, userId);

  if (!['pending', 'cancelled'].includes(transaction.status)) {
    throw new HttpError(
      409,
      `No se puede eliminar una transacción en estado "${transaction.status}"`
    );
  }

  await transaction.destroy();
};