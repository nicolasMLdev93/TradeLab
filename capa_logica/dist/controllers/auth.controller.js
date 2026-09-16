"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.logout = exports.refresh = exports.login = exports.register = void 0;
const env_1 = require("../config/env");
const auth_service_1 = require("../services/auth.service");
const REFRESH_COOKIE = "refreshToken";
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const setRefreshCookie = (res, token) => {
    res.cookie(REFRESH_COOKIE, token, {
        httpOnly: true,
        secure: env_1.env.isProd,
        sameSite: "strict",
        maxAge: REFRESH_MAX_AGE,
    });
};
const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const { user, accessToken, refreshToken } = await (0, auth_service_1.registerUser)({
            username,
            email,
            password,
        });
        setRefreshCookie(res, refreshToken);
        res.status(201).json({ ok: true, user, accessToken });
    }
    catch (err) {
        next(err);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, accessToken, refreshToken } = await (0, auth_service_1.loginUser)({
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
};
exports.login = login;
const refresh = async (req, res, next) => {
    try {
        const token = req.cookies?.[REFRESH_COOKIE];
        if (!token) {
            return res.status(401).json({
                ok: false,
                message: "Refresh token no proporcionado",
            });
        }
        const { accessToken } = await (0, auth_service_1.refreshUserTokens)(token);
        res.json({ ok: true, accessToken });
    }
    catch (err) {
        next(err);
    }
};
exports.refresh = refresh;
const logout = (_req, res) => {
    res.clearCookie(REFRESH_COOKIE);
    res.json({ ok: true, message: "Sesión cerrada" });
};
exports.logout = logout;
const me = async (req, res, next) => {
    try {
        const user = await (0, auth_service_1.getCurrentUser)(req.user.id);
        res.json({ ok: true, user });
    }
    catch (err) {
        next(err);
    }
};
exports.me = me;
