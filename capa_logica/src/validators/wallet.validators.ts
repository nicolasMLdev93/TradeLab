import { body, param } from 'express-validator';

export const createWalletValidators = [
  body('currencyId')
    .notEmpty().withMessage('currencyId es obligatorio')
    .isInt({ min: 1 }).withMessage('currencyId debe ser un entero positivo'),

  body('address')
    .optional({ nullable: true })
    .isString().withMessage('address debe ser string')
    .isLength({ max: 255 }).withMessage('address demasiado largo'),

  body('balance')
    .optional()
    .isDecimal().withMessage('balance debe ser un número decimal')
    .custom((v) => Number(v) >= 0).withMessage('balance no puede ser negativo'),
];

export const walletIdParamValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID inválido'),
];