import { type Request, type Response, type NextFunction } from "express";
import {
  createTransaction,
  listUserTransactions,
  getTransactionById,
  updateTransactionStatus,
  deleteTransaction,
} from "../services/transaction.service";
import type {
  TransactionStatus,
  TransactionType,
} from "../models/transaction.model";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const { walletId, type, amount, price, note } = req.body;

    const transaction = await createTransaction({
      userId,
      walletId: Number(walletId),
      type,
      amount,
      price,
      note,
    });

    res.status(201).json({ ok: true, transaction });
  } catch (err) {
    next(err);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { status, type, walletId, limit, offset } = req.query as Record<
      string,
      string | undefined
    >;

    const result = await listUserTransactions(userId, {
      status: status as TransactionStatus | undefined,
      type: type as TransactionType | undefined,
      walletId: walletId ? Number(walletId) : undefined,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });

    res.json({ ok: true, ...result });
  } catch (err) {
    next(err);
  }
};

export const getOne = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    const transaction = await getTransactionById(id, userId);
    res.json({ ok: true, transaction });
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const id = Number(req.params.id);
    const { status } = req.body as { status: TransactionStatus };

    const transaction = await updateTransactionStatus(id, userId, status);
    res.json({ ok: true, transaction });
  } catch (err) {
    next(err);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    await deleteTransaction(id, userId);

    res.json({ ok: true, message: "Transacción eliminada" });
  } catch (err) {
    next(err);
  }
};

import { transferBetweenWallets } from "../services/transaction.service";

export const transfer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const { fromWalletId, toWalletId, amount, note } = req.body;

    const result = await transferBetweenWallets({
      userId,
      fromWalletId: Number(fromWalletId),
      toWalletId: Number(toWalletId),
      amount,
      note,
    });

    res.status(201).json({
      ok: true,
      message: "Transferencia realizada",
      transfer: result,
    });
  } catch (err) {
    next(err);
  }
};
