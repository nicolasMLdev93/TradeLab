import { type WhereOptions } from 'sequelize';
import { sequelize } from '../config/database';
import {
  Transaction,
  type TransactionStatus,
  type TransactionType,
} from '../models/transaction.model';
import { Wallet } from '../models/wallet.model';
import { Currency } from '../models/currency.model';
import { HttpError } from '../utils/httpError';

const INCOMING_TYPES: TransactionType[] = ['deposit', 'buy', 'transfer_in'];

export const createTransaction = async (input: {
  userId: number;
  walletId: number;
  type: TransactionType;
  amount: string;
  price?: string | null;
  note?: string | null;
}) => {
  return sequelize.transaction(async (t) => {
    const wallet = await Wallet.findByPk(input.walletId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!wallet) {
      throw new HttpError(404, 'Wallet no encontrada');
    }
    if (wallet.userId !== input.userId) {
      throw new HttpError(403, 'No autorizado sobre esta wallet');
    }

    const currentBalance = Number(wallet.balance);
    const amount = Number(input.amount);
    const isIncoming = INCOMING_TYPES.includes(input.type);

    if (!isIncoming && currentBalance < amount) {
      throw new HttpError(400, 'Fondos insuficientes');
    }

    const newBalance = isIncoming
      ? currentBalance + amount
      : currentBalance - amount;

    await wallet.update({ balance: String(newBalance) }, { transaction: t });

    return Transaction.create(
      {
        userId: input.userId,
        walletId: input.walletId,
        type: input.type,
        amount: input.amount,
        price: input.price ?? null,
        note: input.note ?? null,
        status: 'completed',
      },
      { transaction: t }
    );
  });
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

export const transferBetweenWallets = async (input: {
  userId: number;
  fromWalletId: number;
  toWalletId: number;
  amount: string;
  note?: string | null;
}) => {
  const { userId, fromWalletId, toWalletId, amount, note } = input;

  if (fromWalletId === toWalletId) {
    throw new HttpError(400, 'No puedes transferir a la misma wallet');
  }

  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount) || numericAmount <= 0) {
    throw new HttpError(400, 'El monto debe ser mayor a 0');
  }

  return sequelize.transaction(async (t) => {
    const fromWallet = await Wallet.findByPk(fromWalletId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
      include: [{ model: Currency, as: 'currency' }],
    });

    const toWallet = await Wallet.findByPk(toWalletId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
      include: [{ model: Currency, as: 'currency' }],
    });

    if (!fromWallet) throw new HttpError(404, 'Wallet origen no encontrada');
    if (!toWallet) throw new HttpError(404, 'Wallet destino no encontrada');

    if (fromWallet.userId !== userId) {
      throw new HttpError(403, 'No autorizado sobre la wallet origen');
    }
    if (toWallet.userId !== userId) {
      throw new HttpError(403, 'No autorizado sobre la wallet destino');
    }

    if (fromWallet.currencyId !== toWallet.currencyId) {
      throw new HttpError(
        400,
        'Solo puedes transferir entre wallets de la misma moneda'
      );
    }

    const currentBalance = Number(fromWallet.balance);
    if (currentBalance < numericAmount) {
      throw new HttpError(400, 'Fondos insuficientes');
    }

    await fromWallet.update(
      { balance: String(currentBalance - numericAmount) },
      { transaction: t }
    );

    await toWallet.update(
      { balance: String(Number(toWallet.balance) + numericAmount) },
      { transaction: t }
    );

    const outTx = await Transaction.create(
      {
        userId,
        walletId: fromWalletId,
        type: 'transfer_out',
        amount,
        price: null,
        note: note ?? `Transferencia a wallet #${toWalletId}`,
        status: 'completed',
      },
      { transaction: t }
    );

    const inTx = await Transaction.create(
      {
        userId,
        walletId: toWalletId,
        type: 'transfer_in',
        amount,
        price: null,
        note: note ?? `Transferencia desde wallet #${fromWalletId}`,
        status: 'completed',
      },
      { transaction: t }
    );

    return { from: outTx, to: inTx };
  });
};