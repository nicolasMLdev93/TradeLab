"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.refreshUserTokens = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../config/env");
const user_model_1 = require("../models/user.model");
const httpError_1 = require("../utils/httpError");
const jwt_util_1 = require("../utils/jwt.util");
const sanitizeUser = (user) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
});
const buildTokens = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };
    return {
        accessToken: (0, jwt_util_1.signAccessToken)(payload),
        refreshToken: (0, jwt_util_1.signRefreshToken)(payload),
    };
};
const registerUser = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = input;
    const existing = yield user_model_1.User.findOne({ where: { email } });
    if (existing) {
        throw new httpError_1.HttpError(409, 'El email ya está registrado');
    }
    const passwordHash = yield bcryptjs_1.default.hash(password, env_1.env.bcrypt.rounds);
    const user = yield user_model_1.User.create({
        username,
        email,
        passwordHash,
        role: 'user',
    });
    return Object.assign({ user: sanitizeUser(user) }, buildTokens(user));
});
exports.registerUser = registerUser;
const loginUser = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = input;
    const user = yield user_model_1.User.findOne({ where: { email } });
    if (!user) {
        throw new httpError_1.HttpError(401, 'Credenciales inválidas');
    }
    const valid = yield bcryptjs_1.default.compare(password, user.passwordHash);
    if (!valid) {
        throw new httpError_1.HttpError(401, 'Credenciales inválidas');
    }
    return Object.assign({ user: sanitizeUser(user) }, buildTokens(user));
});
exports.loginUser = loginUser;
const refreshUserTokens = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    let decoded;
    try {
        decoded = (0, jwt_util_1.verifyRefreshToken)(refreshToken);
    }
    catch (_a) {
        throw new httpError_1.HttpError(401, 'Refresh token inválido');
    }
    const user = yield user_model_1.User.findByPk(decoded.id);
    if (!user) {
        throw new httpError_1.HttpError(404, 'Usuario no encontrado');
    }
    return buildTokens(user);
});
exports.refreshUserTokens = refreshUserTokens;
const getCurrentUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findByPk(id);
    if (!user) {
        throw new httpError_1.HttpError(404, 'Usuario no encontrado');
    }
    return sanitizeUser(user);
});
exports.getCurrentUser = getCurrentUser;
