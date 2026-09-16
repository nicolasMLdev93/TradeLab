"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletIdParamValidator = exports.createWalletValidators = void 0;
const express_validator_1 = require("express-validator");
exports.createWalletValidators = [
    (0, express_validator_1.body)('currencyId')
        .notEmpty().withMessage('currencyId es obligatorio')
        .isInt({ min: 1 }).withMessage('currencyId debe ser un entero positivo'),
    (0, express_validator_1.body)('address')
        .optional({ nullable: true })
        .isString().withMessage('address debe ser string')
        .isLength({ max: 255 }).withMessage('address demasiado largo'),
    (0, express_validator_1.body)('balance')
        .optional()
        .isDecimal().withMessage('balance debe ser un número decimal')
        .custom((v) => Number(v) >= 0).withMessage('balance no puede ser negativo'),
];
exports.walletIdParamValidator = [
    (0, express_validator_1.param)('id')
        .isInt({ min: 1 }).withMessage('ID inválido'),
];
