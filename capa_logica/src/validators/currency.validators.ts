import { body, param, query } from 'express-validator';

const TYPES = ['fiat', 'crypto'];

export const createCurrencyValidators = [
  body('symbol')
    .trim()
    .notEmpty().withMessage('symbol es obligatorio')
    .isLength({ min: 2, max: 10 }).withMessage('symbol debe tener entre 2 y 10 caracteres')
    .isUppercase().withMessage('symbol debe estar en mayúsculas (ej: BTC, USD)'),

  body('name')
    .trim()
    .notEmpty().withMessage('name es obligatorio')
    .isLength({ min: 2, max: 50 }).withMessage('name debe tener entre 2 y 50 caracteres'),

  body('type')
    .notEmpty().withMessage('type es obligatorio')
    .isIn(TYPES).withMessage(`type debe ser uno de: ${TYPES.join(', ')}`),

  body('decimals')
    .notEmpty().withMessage('decimals es obligatorio')
    .isInt({ min: 0, max: 18 }).withMessage('decimals debe estar entre 0 y 18'),
];

export const updateCurrencyValidators = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('name debe tener entre 2 y 50 caracteres'),

  body('decimals')
    .optional()
    .isInt({ min: 0, max: 18 }).withMessage('decimals debe estar entre 0 y 18'),
];

export const currencyIdParamValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID inválido'),
];

export const listCurrenciesValidators = [
  query('type')
    .optional()
    .isIn(TYPES).withMessage(`type debe ser uno de: ${TYPES.join(', ')}`),
];