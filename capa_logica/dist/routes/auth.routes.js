"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_validators_1 = require("../validators/auth.validators");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
/**
 * @route   POST /api/auth/register
 * @desc    Registrar un usuario nuevo
 * @access  Público
 */
router.post('/register', auth_validators_1.registerValidators, validate_middleware_1.validate, auth_controller_1.register);
/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión
 * @access  Público
 */
router.post('/login', auth_validators_1.loginValidators, validate_middleware_1.validate, auth_controller_1.login);
/**
 * @route   POST /api/auth/refresh
 * @desc    Renovar access token con la cookie de refresh
 * @access  Cookie httpOnly
 */
router.post('/refresh', auth_controller_1.refresh);
/**
 * @route   POST /api/auth/logout
 * @desc    Cerrar sesión (borra la cookie)
 * @access  Público
 */
router.post('/logout', auth_controller_1.logout);
/**
 * @route   GET /api/auth/me
 * @desc    Usuario autenticado actual
 * @access  Privado
 */
router.get('/me', auth_middleware_1.authenticate, auth_controller_1.me);
exports.default = router;
