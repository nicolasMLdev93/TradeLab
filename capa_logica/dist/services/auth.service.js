"use strict";
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
const registerUser = async (input) => {
    const { username, email, password } = input;
    const existing = await user_model_1.User.findOne({ where: { email } });
    if (existing) {
        throw new httpError_1.HttpError(409, 'El email ya está registrado');
    }
    const passwordHash = await bcryptjs_1.default.hash(password, env_1.env.bcrypt.rounds);
    const user = await user_model_1.User.create({
        username,
        email,
        passwordHash,
        role: 'user',
    });
    return {
        user: sanitizeUser(user),
        ...buildTokens(user),
    };
};
exports.registerUser = registerUser;
const loginUser = async (input) => {
    const { email, password } = input;
    const user = await user_model_1.User.findOne({ where: { email } });
    if (!user) {
        throw new httpError_1.HttpError(401, 'Credenciales inválidas');
    }
    const valid = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!valid) {
        throw new httpError_1.HttpError(401, 'Credenciales inválidas');
    }
    return {
        user: sanitizeUser(user),
        ...buildTokens(user),
    };
};
exports.loginUser = loginUser;
const refreshUserTokens = async (refreshToken) => {
    let decoded;
    try {
        decoded = (0, jwt_util_1.verifyRefreshToken)(refreshToken);
    }
    catch {
        throw new httpError_1.HttpError(401, 'Refresh token inválido');
    }
    const user = await user_model_1.User.findByPk(decoded.id);
    if (!user) {
        throw new httpError_1.HttpError(404, 'Usuario no encontrado');
    }
    return buildTokens(user);
};
exports.refreshUserTokens = refreshUserTokens;
const getCurrentUser = async (id) => {
    const user = await user_model_1.User.findByPk(id);
    if (!user) {
        throw new httpError_1.HttpError(404, 'Usuario no encontrado');
    }
    return sanitizeUser(user);
};
exports.getCurrentUser = getCurrentUser;
