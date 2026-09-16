import { Router } from 'express';
import {
  create,
  list,
  getOne,
  updateStatus,
  remove,
} from '../controllers/transaction.controller';
import {
  createTransactionValidators,
  updateStatusValidators,
  transactionIdParamValidator,
  listTransactionsValidators,
} from '../validators/transaction.validators';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Listar transacciones del usuario (filtros + paginación)
 *     tags: [Transactions]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, completed, failed, cancelled]
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [buy, sell, deposit, withdrawal, transfer_in, transfer_out]
 *       - in: query
 *         name: walletId
 *         schema: { type: integer, minimum: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, minimum: 0, default: 0 }
 *     responses:
 *       200:
 *         description: Lista paginada de transacciones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 *                 items:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Transaction' }
 *                 total: { type: integer, example: 42 }
 *                 limit: { type: integer, example: 20 }
 *                 offset: { type: integer, example: 0 }
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/', listTransactionsValidators, validate, list);

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Crear una nueva transacción
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [walletId, type, amount]
 *             properties:
 *               walletId:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *               type:
 *                 type: string
 *                 enum: [buy, sell, deposit, withdrawal, transfer_in, transfer_out]
 *                 example: buy
 *               amount:
 *                 type: string
 *                 example: "0.5"
 *               price:
 *                 type: string
 *                 nullable: true
 *                 example: "45000.00"
 *               note:
 *                 type: string
 *                 maxLength: 255
 *                 nullable: true
 *                 example: Compra inicial
 *     responses:
 *       201:
 *         description: Transacción creada (status pending)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 *                 transaction: { $ref: '#/components/schemas/Transaction' }
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post('/', createTransactionValidators, validate, create);

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Obtener una transacción por ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       200:
 *         description: Transacción encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 *                 transaction: { $ref: '#/components/schemas/Transaction' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id', transactionIdParamValidator, validate, getOne);

/**
 * @swagger
 * /api/transactions/{id}/status:
 *   patch:
 *     summary: Cambiar el estado de una transacción pendiente
 *     tags: [Transactions]
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [completed, failed, cancelled]
 *                 example: completed
 *     responses:
 *       200:
 *         description: Estado actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 *                 transaction: { $ref: '#/components/schemas/Transaction' }
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         description: Solo se pueden modificar transacciones pendientes
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.patch(
  '/:id/status',
  transactionIdParamValidator,
  updateStatusValidators,
  validate,
  updateStatus
);

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Eliminar transacción (solo pending o cancelled)
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       200:
 *         description: Transacción eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 *                 message: { type: string, example: Transacción eliminada }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         description: No se puede eliminar una transacción en ese estado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.delete('/:id', transactionIdParamValidator, validate, remove);

export default router;