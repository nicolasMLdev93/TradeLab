import { body, param, query } from 'express-validator';

const TYPES = ['buy', 'sell', 'deposit', 'withdrawal', 'transfer_in', 'transfer_out'];
const STATUSES = ['pending', 'completed', 'failed', 'cancelled'];

export const createTransactionValidators = [
  body('walletId')
    .notEmpty().withMessage('walletId es obligatorio')
    .isInt({ min: 1 }).withMessage('walletId debe ser un entero positivo'),

  body('type')
    .notEmpty().withMessage('type es obligatorio')
    .isIn(TYPES).withMessage(`type debe ser uno de: ${TYPES.join(', ')}`),

  body('amount')
    .notEmpty().withMessage('amount es obligatorio')
    .isDecimal().withMessage('amount debe ser un número decimal')
    .custom((v) => Number(v) > 0).withMessage('amount debe ser mayor a 0'),

  body('price')
    .optional({ nullable: true })
    .isDecimal().withMessage('price debe ser un número decimal')
    .custom((v) => Number(v) >= 0).withMessage('price no puede ser negativo'),

  body('note')
    .optional({ nullable: true })
    .isString().withMessage('note debe ser string')
    .isLength({ max: 255 }).withMessage('note no puede pasar de 255 caracteres'),
];

export const updateStatusValidators = [
  body('status')
    .notEmpty().withMessage('status es obligatorio')
    .isIn(['completed', 'failed', 'cancelled'])
    .withMessage('status debe ser completed, failed o cancelled'),
];

export const transactionIdParamValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID inválido'),
];

export const listTransactionsValidators = [
  query('status')
    .optional()
    .isIn(STATUSES).withMessage(`status debe ser uno de: ${STATUSES.join(', ')}`),

  query('type')
    .optional()
    .isIn(TYPES).withMessage(`type debe ser uno de: ${TYPES.join(', ')}`),

  query('walletId')
    .optional()
    .isInt({ min: 1 }).withMessage('walletId inválido'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('limit entre 1 y 100'),

  query('offset')
    .optional()
    .isInt({ min: 0 }).withMessage('offset debe ser >= 0'),
];