"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty())
        return next();
    return res.status(400).json({
        ok: false,
        message: 'Errores de validación',
        errors: errors.array().map((e) => ({
            field: e.type === 'field' ? e.path : undefined,
            message: e.msg,
        })),
    });
};
exports.validate = validate;
