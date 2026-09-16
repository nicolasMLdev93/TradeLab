import { type Request, type Response, type NextFunction } from 'express';
import {
  createWallet,
  listUserWallets,
  deleteWallet,
} from '../services/wallet.service';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { currencyId, balance, address } = req.body;

    const wallet = await createWallet({
      userId,
      currencyId: Number(currencyId),
      balance,
      address,
    });

    res.status(201).json({ ok: true, wallet });
  } catch (err) {
    next(err);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const wallets = await listUserWallets(userId);
    res.json({ ok: true, wallets });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const walletId = Number(req.params.id);

    await deleteWallet(walletId, userId);

    res.json({ ok: true, message: 'Wallet eliminada' });
  } catch (err) {
    next(err);
  }
};