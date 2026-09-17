"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const currency_controller_1 = require("../controllers/currency.controller");
const currency_validators_1 = require("../validators/currency.validators");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/currencies:
 *   get:
 *     summary: Listar todas las monedas
 *     tags: [Currencies]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [fiat, crypto]
 *         description: Filtrar por tipo de moneda
 *     responses:
 *       200:
 *         description: Lista de monedas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 *                 currencies:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Currency' }
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.get("/", currency_validators_1.listCurrenciesValidators, validate_middleware_1.validate, currency_controller_1.list);
/**
 * @swagger
 * /api/currencies/prices:
 *   get:
 *     summary: Catálogo de monedas con precios en vivo (USD)
 *     tags: [Currencies]
 *     security: []
 *     responses:
 *       200:
 *         description: Lista de monedas con precio USD y cambio 24h
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 *                 currencies:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       symbol: { type: string, example: BTC }
 *                       name: { type: string, example: Bitcoin }
 *                       type: { type: string, enum: [fiat, crypto] }
 *                       decimals: { type: integer, example: 8 }
 *                       usd: { type: number, example: 45230.12 }
 *                       change24h: { type: number, example: 1.45 }
 *                 lastUpdated: { type: string, format: date-time }
 */
router.get("/prices", currency_controller_1.listWithPrices);
/**
 * @swagger
 * /api/currencies/symbol/{symbol}:
 *   get:
 *     summary: Obtener una moneda por símbolo (BTC, USD, etc.)
 *     tags: [Currencies]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema: { type: string }
 *         example: BTC
 *     responses:
 *       200:
 *         description: Moneda encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 *                 currency: { $ref: '#/components/schemas/Currency' }
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/symbol/:symbol", currency_controller_1.getBySymbol);
/**
 * @swagger
 * /api/currencies/{id}:
 *   get:
 *     summary: Obtener una moneda por ID
 *     tags: [Currencies]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       200:
 *         description: Moneda encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 *                 currency: { $ref: '#/components/schemas/Currency' }
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id", currency_validators_1.currencyIdParamValidator, validate_middleware_1.validate, currency_controller_1.getOne);
/**
 * @swagger
 * /api/currencies:
 *   post:
 *     summary: Crear una moneda (solo admin)
 *     tags: [Currencies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [symbol, name, type, decimals]
 *             properties:
 *               symbol:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 10
 *                 example: BTC
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: Bitcoin
 *               type:
 *                 type: string
 *                 enum: [fiat, crypto]
 *                 example: crypto
 *               decimals:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 18
 *                 example: 8
 *     responses:
 *       201:
 *         description: Moneda creada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 *                 currency: { $ref: '#/components/schemas/Currency' }
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       409:
 *         description: Ya existe una moneda con ese símbolo
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post("/", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)("admin"), currency_validators_1.createCurrencyValidators, validate_middleware_1.validate, currency_controller_1.create);
/**
 * @swagger
 * /api/currencies/{id}:
 *   patch:
 *     summary: Actualizar una moneda (solo admin)
 *     tags: [Currencies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: Bitcoin (BTC)
 *               decimals:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 18
 *                 example: 8
 *     responses:
 *       200:
 *         description: Moneda actualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 *                 currency: { $ref: '#/components/schemas/Currency' }
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)("admin"), currency_validators_1.currencyIdParamValidator, currency_validators_1.updateCurrencyValidators, validate_middleware_1.validate, currency_controller_1.update);
/**
 * @swagger
 * /api/currencies/{id}:
 *   delete:
 *     summary: Eliminar una moneda (solo admin)
 *     tags: [Currencies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       200:
 *         description: Moneda eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 *                 message: { type: string, example: Moneda eliminada }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         description: Hay wallets usando esta moneda
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.delete("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)("admin"), currency_validators_1.currencyIdParamValidator, validate_middleware_1.validate, currency_controller_1.remove);
exports.default = router;
