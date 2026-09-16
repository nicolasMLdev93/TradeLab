import { Router } from 'express';
import {
  register,
  login,
  refresh,
  logout,
  me,
} from '../controllers/auth.controller';
import {
  registerValidators,
  loginValidators,
} from '../validators/auth.validators';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Registrar un usuario nuevo
 * @access  Público
 */
router.post('/register', registerValidators, validate, register);

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión
 * @access  Público
 */
router.post('/login', loginValidators, validate, login);

/**
 * @route   POST /api/auth/refresh
 * @desc    Renovar access token con la cookie de refresh
 * @access  Cookie httpOnly
 */
router.post('/refresh', refresh);

/**
 * @route   POST /api/auth/logout
 * @desc    Cerrar sesión (borra la cookie)
 * @access  Público
 */
router.post('/logout', logout);

/**
 * @route   GET /api/auth/me
 * @desc    Usuario autenticado actual
 * @access  Privado
 */
router.get('/me', authenticate, me);

export default router;