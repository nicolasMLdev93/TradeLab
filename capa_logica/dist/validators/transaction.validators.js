"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferValidators = exports.listTransactionsValidators = exports.transactionIdParamValidator = exports.updateStatusValidators = exports.createTransactionValidators = void 0;
const express_validator_1 = require("express-validator");
const TYPES = ['buy', 'sell', 'deposit', 'withdrawal', 'transfer_in', 'transfer_out'];
const STATUSES = ['pending', 'completed', 'failed', 'cancelled'];
exports.createTransactionValidators = [
    (0, express_validator_1.body)('walletId')
        .notEmpty().withMessage('walletId es obligatorio')
        .isInt({ min: 1 }).withMessage('walletId debe ser un entero positivo'),
    (0, express_validator_1.body)('type')
        .notEmpty().withMessage('type es obligatorio')
        .isIn(TYPES).withMessage(`type debe ser uno de: ${TYPES.join(', ')}`),
    (0, express_validator_1.body)('amount')
        .notEmpty().withMessage('amount es obligatorio')
        .isDecimal().withMessage('amount debe ser un número decimal')
        .custom((v) => Number(v) > 0).withMessage('amount debe ser mayor a 0'),
    (0, express_validator_1.body)('price')
        .optional({ nullable: true })
        .isDecimal().withMessage('price debe ser un número decimal')
        .custom((v) => Number(v) >= 0).withMessage('price no puede ser negativo'),
    (0, express_validator_1.body)('note')
        .optional({ nullable: true })
        .isString().withMessage('note debe ser string')
        .isLength({ max: 255 }).withMessage('note no puede pasar de 255 caracteres'),
];
exports.updateStatusValidators = [
    (0, express_validator_1.body)('status')
        .notEmpty().withMessage('status es obligatorio')
        .isIn(['completed', 'failed', 'cancelled'])
        .withMessage('status debe ser completed, failed o cancelled'),
];
exports.transactionIdParamValidator = [
    (0, express_validator_1.param)('id')
        .isInt({ min: 1 }).withMessage('ID inválido'),
];
exports.listTransactionsValidators = [
    (0, express_validator_1.query)('status')
        .optional()
        .isIn(STATUSES).withMessage(`status debe ser uno de: ${STATUSES.join(', ')}`),
    (0, express_validator_1.query)('type')
        .optional()
        .isIn(TYPES).withMessage(`type debe ser uno de: ${TYPES.join(', ')}`),
    (0, express_validator_1.query)('walletId')
        .optional()
        .isInt({ min: 1 }).withMessage('walletId inválido'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('limit entre 1 y 100'),
    (0, express_validator_1.query)('offset')
        .optional()
        .isInt({ min: 0 }).withMessage('offset debe ser >= 0'),
];
exports.transferValidators = [
    (0, express_validator_1.body)('fromWalletId')
        .notEmpty().withMessage('fromWalletId es obligatorio')
        .isInt({ min: 1 }).withMessage('fromWalletId inválido'),
    (0, express_validator_1.body)('toWalletId')
        .notEmpty().withMessage('toWalletId es obligatorio')
        .isInt({ min: 1 }).withMessage('toWalletId inválido'),
    (0, express_validator_1.body)('amount')
        .notEmpty().withMessage('amount es obligatorio')
        .isDecimal().withMessage('amount debe ser un número decimal')
        .custom((v) => Number(v) > 0).withMessage('amount debe ser mayor a 0'),
    (0, express_validator_1.body)('note')
        .optional({ nullable: true })
        .isString().withMessage('note debe ser string')
        .isLength({ max: 255 }).withMessage('note demasiado largo'),
];
