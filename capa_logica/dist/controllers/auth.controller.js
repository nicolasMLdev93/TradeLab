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
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.logout = exports.refresh = exports.login = exports.register = void 0;
const env_1 = require("../config/env");
const auth_service_1 = require("../services/auth.service");
const REFRESH_COOKIE = 'refreshToken';
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const setRefreshCookie = (res, token) => {
    res.cookie(REFRESH_COOKIE, token, {
        httpOnly: true,
        secure: env_1.env.isProd,
        sameSite: 'strict',
        maxAge: REFRESH_MAX_AGE,
    });
};
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const { user, accessToken, refreshToken } = yield (0, auth_service_1.registerUser)({
            username,
            email,
            password,
        });
        setRefreshCookie(res, refreshToken);
        res.status(201).json({
            ok: true,
            user,
            accessToken,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const { user, accessToken, refreshToken } = yield (0, auth_service_1.loginUser)({
            email,
            password,
        });
        setRefreshCookie(res, refreshToken);
        res.json({
            ok: true,
            user,
            accessToken,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.login = login;
const refresh = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a[REFRESH_COOKIE];
        if (!token) {
            return res.status(401).json({
                ok: false,
                message: 'Refresh token no proporcionado',
            });
        }
        const { accessToken } = yield (0, auth_service_1.refreshUserTokens)(token);
        res.json({ ok: true, accessToken });
    }
    catch (err) {
        next(err);
    }
});
exports.refresh = refresh;
const logout = (_req, res) => {
    res.clearCookie(REFRESH_COOKIE);
    res.json({ ok: true, message: 'Sesión cerrada' });
};
exports.logout = logout;
const me = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, auth_service_1.getCurrentUser)(req.user.id);
        res.json({ ok: true, user });
    }
    catch (err) {
        next(err);
    }
});
exports.me = me;
