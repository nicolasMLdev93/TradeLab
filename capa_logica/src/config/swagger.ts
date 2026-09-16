import swaggerJSDoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TradeLab API',
      version: '1.0.0',
      description: 'API para gestión de wallets y transacciones de criptomonedas',
    },
    servers: [
      { url: `http://localhost:${env.port}`, description: 'Servidor local' },
    ],
    tags: [
      { name: 'Auth', description: 'Autenticación y sesiones' },
      { name: 'Currencies', description: 'Catálogo de monedas' },
      { name: 'Wallets', description: 'Wallets del usuario' },
      { name: 'Transactions', description: 'Transacciones y movimientos' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            username: { type: 'string', example: 'juanperez' },
            email: { type: 'string', format: 'email', example: 'juan@example.com' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Currency: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            symbol: { type: 'string', example: 'BTC' },
            name: { type: 'string', example: 'Bitcoin' },
            type: { type: 'string', enum: ['fiat', 'crypto'], example: 'crypto' },
            decimals: { type: 'integer', example: 8 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Wallet: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            userId: { type: 'integer', example: 1 },
            currencyId: { type: 'integer', example: 1 },
            balance: { type: 'string', example: '0.00000000' },
            address: { type: 'string', nullable: true, example: '0xabc123' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Transaction: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            userId: { type: 'integer', example: 1 },
            walletId: { type: 'integer', example: 1 },
            type: {
              type: 'string',
              enum: ['buy', 'sell', 'deposit', 'withdrawal', 'transfer_in', 'transfer_out'],
              example: 'buy',
            },
            amount: { type: 'string', example: '0.50000000' },
            price: { type: 'string', nullable: true, example: '45000.00000000' },
            status: {
              type: 'string',
              enum: ['pending', 'completed', 'failed', 'cancelled'],
              example: 'pending',
            },
            note: { type: 'string', nullable: true, example: 'Compra inicial' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            ok: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Mensaje de error' },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            ok: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Errores de validación' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'Email inválido' },
                },
              },
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            ok: { type: 'boolean', example: true },
            user: { $ref: '#/components/schemas/User' },
            accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: 'No autenticado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: { ok: false, message: 'Token no proporcionado' },
            },
          },
        },
        Forbidden: {
          description: 'No autorizado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: { ok: false, message: 'No autorizado' },
            },
          },
        },
        NotFound: {
          description: 'Recurso no encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
        ValidationError: {
          description: 'Errores de validación',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ValidationError' },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);