"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidators = exports.registerValidators = void 0;
const express_validator_1 = require("express-validator");
exports.registerValidators = [
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 8 }).withMessage('Mínimo 8 caracteres')
        .matches(/[A-Z]/).withMessage('Debe contener al menos una mayúscula')
        .matches(/[a-z]/).withMessage('Debe contener al menos una minúscula')
        .matches(/\d/).withMessage('Debe contener al menos un número'),
    (0, express_validator_1.body)('confirmPassword')
        .notEmpty().withMessage('Debes confirmar la contraseña')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Las contraseñas no coinciden'),
];
exports.loginValidators = [
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty().withMessage('La contraseña es obligatoria'),
];
