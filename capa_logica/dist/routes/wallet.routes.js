"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wallet_controller_1 = require("../controllers/wallet.controller");
const wallet_validators_1 = require("../validators/wallet.validators");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Todas las rutas requieren autenticación
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * /api/wallets:
 *   get:
 *     summary: Listar wallets del usuario autenticado
 *     tags: [Wallets]
 *     responses:
 *       200:
 *         description: Lista de wallets del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 *                 wallets:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Wallet' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/', wallet_controller_1.list);
/**
 * @swagger
 * /api/wallets:
 *   post:
 *     summary: Crear una nueva wallet
 *     tags: [Wallets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currencyId]
 *             properties:
 *               currencyId:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *               address:
 *                 type: string
 *                 maxLength: 255
 *                 nullable: true
 *                 example: "0xabc123def456"
 *               balance:
 *                 type: string
 *                 example: "0"
 *     responses:
 *       201:
 *         description: Wallet creada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 *                 wallet: { $ref: '#/components/schemas/Wallet' }
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       409:
 *         description: Ya tienes una wallet de esa moneda
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post('/', wallet_validators_1.createWalletValidators, validate_middleware_1.validate, wallet_controller_1.create);
/**
 * @swagger
 * /api/wallets/{id}:
 *   delete:
 *     summary: Eliminar una wallet del usuario autenticado
 *     tags: [Wallets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       200:
 *         description: Wallet eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 *                 message: { type: string, example: Wallet eliminada }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:id', wallet_validators_1.walletIdParamValidator, validate_middleware_1.validate, wallet_controller_1.remove);
exports.default = router;
