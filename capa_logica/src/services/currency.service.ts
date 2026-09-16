import { Currency, type CurrencyType } from '../models/currency.model';
import { HttpError } from '../utils/httpError';

export const createCurrency = async (input: {
  symbol: string;
  name: string;
  type: CurrencyType;
  decimals: number;
}) => {
  const { symbol, name, type, decimals } = input;

  const existing = await Currency.findOne({ where: { symbol } });
  if (existing) {
    throw new HttpError(409, 'Ya existe una moneda con ese símbolo');
  }

  const currency = await Currency.create({
    symbol,
    name,
    type,
    decimals,
  });

  return currency;
};

export const listCurrencies = async (filters: {
  type?: CurrencyType;
} = {}) => {
  const where: Record<string, unknown> = {};
  if (filters.type) where['type'] = filters.type;

  return Currency.findAll({
    where,
    order: [['symbol', 'ASC']],
  });
};

export const getCurrencyById = async (id: number) => {
  const currency = await Currency.findByPk(id);
  if (!currency) {
    throw new HttpError(404, 'Moneda no encontrada');
  }
  return currency;
};

export const getCurrencyBySymbol = async (symbol: string) => {
  const currency = await Currency.findOne({
    where: { symbol: symbol.toUpperCase() },
  });
  if (!currency) {
    throw new HttpError(404, 'Moneda no encontrada');
  }
  return currency;
};

export const updateCurrency = async (
  id: number,
  input: {
    name?: string;
    decimals?: number;
  }
) => {
  const currency = await getCurrencyById(id);

  if (input.name !== undefined) currency.name = input.name;
  if (input.decimals !== undefined) currency.decimals = input.decimals;

  await currency.save();

  return currency;
};

export const deleteCurrency = async (id: number) => {
  const currency = await getCurrencyById(id);
  await currency.destroy();
};