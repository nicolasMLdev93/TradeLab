# TradeLab

Aplicación full-stack para gestión de wallets y transacciones de criptomonedas. Backend en Node.js + Express + Sequelize + MySQL, frontend en React + TypeScript + Vite + TailwindCSS.

---

## 📋 Tabla de contenidos

- [Características](#-características)
- [Stack tecnológico](#-stack-tecnológico)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Requisitos previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Variables de entorno](#-variables-de-entorno)
- [Base de datos](#-base-de-datos)
- [Scripts disponibles](#-scripts-disponibles)
- [Mapa de rutas](#-mapa-de-rutas)
- [API Endpoints](#-api-endpoints)
- [Autenticación](#-autenticación)
- [Documentación Swagger](#-documentación-swagger)
- [Testing](#-testing)
- [Integración con CoinGecko](#-integración-con-coingecko)
- [Despliegue](#-despliegue)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## ✨ Características

- 🔐 **Autenticación completa**: registro, login, refresh token con cookies httpOnly
- 👤 **Roles de usuario**: `user` y `admin` con autorización por middleware
- 💼 **Gestión de wallets**: crear, listar y eliminar wallets por moneda
- 💸 **Transacciones**: compra, venta, depósito, retiro y transferencias con estados (`pending`, `completed`, `failed`, `cancelled`)
- 🪙 **Catálogo de monedas**: fiat y crypto con símbolos, nombres y decimales
- 📊 **Precios en tiempo real**: integración con la API de CoinGecko
- 📖 **Documentación interactiva**: Swagger UI en `/api-docs`
- ✅ **Tests de integración**: Jest + Supertest con SQLite en memoria
- 🎨 **Frontend moderno**: React + TypeScript + TailwindCSS con tema oscuro

---

## 🛠 Stack tecnológico

### Backend

| Tecnología | Uso |
|-----------|-----|
| Node.js + TypeScript | Runtime y tipado |
| Express 5 | Framework HTTP |
| Sequelize + sequelize-typescript | ORM con decoradores |
| MySQL | Base de datos relacional |
| JWT (jsonwebtoken) | Autenticación con access + refresh tokens |
| bcryptjs | Hash de contraseñas |
| express-validator | Validación de requests |
| Zod | Validación de variables de entorno |
| Swagger (swagger-jsdoc + swagger-ui-express) | Documentación de API |
| Jest + Supertest + ts-jest | Testing |
| better-sqlite3 | DB en memoria para tests |
| Helmet + CORS | Seguridad HTTP |
| Morgan | Logging de requests |

### Frontend

| Tecnología | Uso |
|-----------|-----|
| React 18 | UI |
| TypeScript | Tipado |
| Vite | Build tool |
| TailwindCSS | Estilos |
| React Router | Navegación |
| Axios | Cliente HTTP |
| react-icons | Iconografía |

---

## 📁 Estructura del proyecto

```
TradeLab/
├── capa_logica/                    # Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts         # Conexión Sequelize
│   │   │   ├── env.ts              # Validación con Zod
│   │   │   └── swagger.ts          # Configuración Swagger
│   │   ├── controllers/            # Lógica de request/response
│   │   ├── database/
│   │   │   ├── migrations/         # Migraciones Sequelize
│   │   │   └── seeders/            # Seeders
│   │   ├
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   ├── role.middleware.ts
│   │   │   └── validate.middleware.ts
│   │   ├── models/                 # Modelos Sequelize
│   │   ├── routes/                 # Rutas Express
│   │   ├── services/               # Lógica de negocio
│   │   ├── tests/                  # Tests de integración
│   │   ├── utils/
│   │   ├── validators/             # Reglas express-validator
│   │   ├── app.ts                  # Configuración de Express
│   │   └── server.ts               # Entry point
│   ├── .env
│   ├── .env.example
│   ├── jest.config.js
│   ├── tsconfig.json
│   └── package.json
│
└── frontend/                       # Frontend
    ├── src/
    │   ├── api/                    # Servicios Axios
    │   ├── components/             # Componentes React
    │   ├── images/
    │   ├── utils/
    │   │   └── config.ts           # API_BASE_URL
    │   ├── App.tsx
    │   └── main.tsx
    └── package.json
```

---

## 📦 Requisitos previos

- **Node.js** >= 18
- **npm** >= 9
- **MySQL** >= 8 (o cuenta en Clever Cloud, PlanetScale, etc.)
- **Cuenta en CoinGecko** (plan Demo gratuito) → [Registrarse](https://www.coingecko.com/en/developers/dashboard)

---

## 🚀 Instalación

### Backend

```bash
cd capa_logica
npm install
cp .env.example .env    # edita las variables
npm run migrate         # corre las migraciones
npm run seed            # (opcional) datos de prueba
npm run dev             # arranca en http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev             # arranca en http://localhost:5173
```

---

## 🔐 Variables de entorno

### Backend (`.env`)

```env
# App
NODE_ENV=development
PORT=3000
CLIENT_URL=http://localhost:5173

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tradelab
DB_USER=root
DB_PASSWORD=secret

# JWT
JWT_SECRET=tu_secreto_de_al_menos_32_caracteres
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=otro_secreto_distinto_de_32_chars
JWT_REFRESH_EXPIRES_IN=7d

# Bcrypt
BCRYPT_ROUNDS=10

# CoinGecko
COINGECKO_API_KEY=CG-tu_demo_key
```

Genera secretos seguros con:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### Frontend (`src/utils/config.ts`)

```ts
export const API_BASE_URL = 'http://localhost:3000/api';
```

---

## 🗄 Base de datos

### Modelos

| Tabla | Descripción |
|-------|-------------|
| `users` | Usuarios con `email`, `username`, `passwordHash`, `role` |
| `currencies` | Monedas con `symbol`, `name`, `type` (fiat/crypto), `decimals` |
| `wallets` | Wallets por usuario y moneda con `balance` y `address` |
| `transactions` | Movimientos con `type`, `amount`, `price`, `status`, `note` |

### Diagrama de relaciones

```
users ──┬── wallets ── transactions
        │      │
        │      └── currencies
        └── transactions
```

### Migraciones

```bash
npm run migrate              # Aplica todas las migraciones
npm run migrate:undo         # Revierte la última
npm run migrate:undo:all     # Revierte todas
npm run seed                 # Corre los seeders
npm run db:reset             # Revierte + migra + seedea (dev only)
```

---

## 📜 Scripts disponibles

### Backend

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor en modo desarrollo con hot-reload |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Servidor en producción |
| `npm run migrate` | Aplica migraciones |
| `npm run migrate:undo` | Revierte la última migración |
| `npm run seed` | Corre seeders |
| `npm test` | Corre todos los tests |
| `npm run test:watch` | Tests en modo watch |
| `npm run test:coverage` | Tests con reporte de cobertura |
| `npm run typecheck` | Verifica tipos sin compilar |

### Frontend

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo Vite |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build |

---

## 🗺 Mapa de rutas

```
/api-docs          → Swagger UI interactiva
/api-docs.json     → Especificación OpenAPI (JSON)
/health            → Health check del servidor

/api/auth          → Registro, login, refresh, logout, me
/api/currencies    → Catálogo de monedas (fiat + crypto)
/api/wallets       → Wallets del usuario
/api/transactions  → Movimientos financieros
```

---

## 🌐 API Endpoints

### Documentación — raíz

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api-docs` | Swagger UI interactiva | No |
| GET | `/api-docs.json` | Especificación OpenAPI cruda | No |
| GET | `/health` | Health check del servidor | No |

### Auth — `/api/auth`

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/register` | Registrar usuario | No |
| POST | `/login` | Iniciar sesión | No |
| POST | `/refresh` | Renovar access token | Cookie |
| POST | `/logout` | Cerrar sesión | No |
| GET | `/me` | Usuario actual | Bearer |

### Currencies — `/api/currencies`

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/` | Listar todas | No |
| GET | `/:id` | Por ID | No |
| GET | `/symbol/:symbol` | Por símbolo | No |
| POST | `/` | Crear moneda | Admin |
| PATCH | `/:id` | Actualizar | Admin |
| DELETE | `/:id` | Eliminar | Admin |

### Wallets — `/api/wallets`

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/` | Listar del usuario | Bearer |
| POST | `/` | Crear wallet | Bearer |
| DELETE | `/:id` | Eliminar wallet propia | Bearer |

### Transactions — `/api/transactions`

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/` | Listar con filtros | Bearer |
| POST | `/` | Crear transacción | Bearer |
| GET | `/:id` | Detalle | Bearer |
| PATCH | `/:id/status` | Cambiar estado | Bearer |
| DELETE | `/:id` | Eliminar | Bearer |

### Crypto (CoinGecko) — `/api/crypto`

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/top?limit=50` | Top monedas por market cap | Bearer |
| GET | `/prices?ids=bitcoin,ethereum` | Precios actuales | Bearer |
| GET | `/search?q=bitcoin` | Buscar monedas | Bearer |
| GET | `/:id` | Detalle de moneda | Bearer |
| GET | `/:id/chart?days=7` | Datos históricos | Bearer |

---

## 🔑 Autenticación

La autenticación usa el patrón **access token + refresh token**:

1. **Login** → devuelve `accessToken` (JWT, 15 min) en el body y setea `refreshToken` (JWT, 7 días) en una cookie `httpOnly`.
2. El frontend guarda el `accessToken` en `localStorage` y lo envía en cada request con `Authorization: Bearer <token>`.
3. Cuando el access token expira, el frontend llama a `/auth/refresh` (la cookie viaja automáticamente) y obtiene uno nuevo.
4. **Logout** → borra la cookie de refresh.

### Ejemplo de request autenticado

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbGci..."
```

---

## 📖 Documentación Swagger

Con el servidor corriendo:

```
http://localhost:3000/api-docs
```

---

## 🧪 Testing

Los tests usan **Jest + Supertest** con **SQLite en memoria** (no afectan tu DB de desarrollo).

```bash
cd capa_logica
npm test
```

Ejemplo de salida:


### Estructura de tests

```
src/tests/
├── setup.ts          # Arranca SQLite y sincroniza modelos
├── db.helper.ts      # truncateAll() para limpiar entre tests
├── auth.helper.ts    # Helpers de registro/login
├── auth.test.ts
├── currency.test.ts
├── wallet.test.ts
└── transaction.test.ts
```

---

## 🪙 Integración con CoinGecko

TradeLab usa la API de CoinGecko para precios de criptomonedas.

### Setup

1. Regístrate en [CoinGecko Developer](https://www.coingecko.com/en/developers/dashboard)
2. Genera una **Demo API Key**
3. Agrega `COINGECKO_API_KEY` al `.env`

### Plan Demo gratuito

- 10,000 llamadas/mes
- 100 llamadas/minuto
- Requiere mostrar atribución a CoinGecko en tu app

---

## 🚢 Despliegue

### Backend

Opciones recomendadas:

- **Render** → gratis con DB externa
- **Railway** → simple, con MySQL incluido
- **Fly.io** → buena latencia global
- **VPS** (DigitalOcean, Hetzner) → control total

Pasos:

```bash
npm run build
NODE_ENV=production npm start
```

### Base de datos

Opciones gestionadas:

- **Clever Cloud** (usado en desarrollo)
---

## 🔗 Recursos

- [Documentación de Express](https://expressjs.com/)
- [Documentación de Sequelize](https://sequelize.org/)
- [Documentación de React](https://react.dev/)
- [Documentación de CoinGecko API](https://docs.coingecko.com/)
- [Sequelize TypeScript](https://github.com/sequelize/sequelize-typescript)
