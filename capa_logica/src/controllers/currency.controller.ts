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
import { getPricesBySymbols } from '../services/crypto.service';
import { Currency } from '../models/currency.model';

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

export const listWithPrices = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currencies = await Currency.findAll({
      order: [['symbol', 'ASC']],
    });

    const cryptoSymbols = currencies
      .filter((c) => c.type === 'crypto')
      .map((c) => c.symbol);

    const pricesList = await getPricesBySymbols(cryptoSymbols);
    const pricesBySymbol = new Map(pricesList.map((p) => [p.symbol, p]));

    const result = currencies.map((c) => {
      const symbol = c.symbol.toUpperCase();

      if (c.type === 'fiat') {
        return {
          id: c.id,           
          symbol,
          name: c.name,
          type: c.type,
          decimals: c.decimals,
          usd: 1,
          change24h: 0,
        };
      }

      const price = pricesBySymbol.get(symbol);

      return {
        id: c.id,             
        symbol,
        name: c.name,
        type: c.type,
        decimals: c.decimals,
        usd: price?.usd ?? 0,
        change24h: price?.usd_24h_change ?? 0,
      };
    });

    res.json({
      ok: true,
      currencies: result,
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
};