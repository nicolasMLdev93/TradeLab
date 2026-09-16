import { type Request, type Response, type NextFunction } from 'express';
import {
  createCurrency,
  listCurrencies,
  getCurrencyById,
  getCurrencyBySymbol,
  updateCurrency,
  deleteCurrency,
} from '../services/currency.service';
import type { CurrencyType } from '../models/currency.model';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { symbol, name, type, decimals } = req.body;

    const currency = await createCurrency({
      symbol: symbol.toUpperCase(),
      name,
      type,
      decimals: Number(decimals),
    });

    res.status(201).json({ ok: true, currency });
  } catch (err) {
    next(err);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type } = req.query as { type?: CurrencyType };

    const currencies = await listCurrencies({ type });
    res.json({ ok: true, currencies });
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const currency = await getCurrencyById(id);
    res.json({ ok: true, currency });
  } catch (err) {
    next(err);
  }
};

export const getBySymbol = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const symbol = String(req.params.symbol);
    const currency = await getCurrencyBySymbol(symbol);
    res.json({ ok: true, currency });
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { name, decimals } = req.body;

    const currency = await updateCurrency(id, {
      name,
      decimals: decimals !== undefined ? Number(decimals) : undefined,
    });

    res.json({ ok: true, currency });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await deleteCurrency(id);
    res.json({ ok: true, message: 'Moneda eliminada' });
  } catch (err) {
    next(err);
  }
};