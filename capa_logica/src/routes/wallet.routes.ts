import { Router } from 'express';
import {
  create,
  list,
  remove,
} from '../controllers/wallet.controller';
import {
  createWalletValidators,
  walletIdParamValidator,
} from '../validators/wallet.validators';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

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
router.get('/', list);

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
router.post('/', createWalletValidators, validate, create);

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
router.delete('/:id', walletIdParamValidator, validate, remove);

export default router;