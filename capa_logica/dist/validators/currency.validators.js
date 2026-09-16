"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCurrenciesValidators = exports.currencyIdParamValidator = exports.updateCurrencyValidators = exports.createCurrencyValidators = void 0;
const express_validator_1 = require("express-validator");
const TYPES = ['fiat', 'crypto'];
exports.createCurrencyValidators = [
    (0, express_validator_1.body)('symbol')
        .trim()
        .notEmpty().withMessage('symbol es obligatorio')
        .isLength({ min: 2, max: 10 }).withMessage('symbol debe tener entre 2 y 10 caracteres')
        .isUppercase().withMessage('symbol debe estar en mayúsculas (ej: BTC, USD)'),
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty().withMessage('name es obligatorio')
        .isLength({ min: 2, max: 50 }).withMessage('name debe tener entre 2 y 50 caracteres'),
    (0, express_validator_1.body)('type')
        .notEmpty().withMessage('type es obligatorio')
        .isIn(TYPES).withMessage(`type debe ser uno de: ${TYPES.join(', ')}`),
    (0, express_validator_1.body)('decimals')
        .notEmpty().withMessage('decimals es obligatorio')
        .isInt({ min: 0, max: 18 }).withMessage('decimals debe estar entre 0 y 18'),
];
exports.updateCurrencyValidators = [
    (0, express_validator_1.body)('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('name debe tener entre 2 y 50 caracteres'),
    (0, express_validator_1.body)('decimals')
        .optional()
        .isInt({ min: 0, max: 18 }).withMessage('decimals debe estar entre 0 y 18'),
];
exports.currencyIdParamValidator = [
    (0, express_validator_1.param)('id')
        .isInt({ min: 1 }).withMessage('ID inválido'),
];
exports.listCurrenciesValidators = [
    (0, express_validator_1.query)('type')
        .optional()
        .isIn(TYPES).withMessage(`type debe ser uno de: ${TYPES.join(', ')}`),
];
