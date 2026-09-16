"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.createAdminAndGetToken = exports.createUserAndGetToken = exports.loginUser = exports.registerUser = exports.app = void 0;
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../index");
exports.app = (0, index_1.createApp)();
const registerUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, supertest_1.default)(exports.app).post('/api/auth/register').send(Object.assign(Object.assign({}, user), { confirmPassword: user.password }));
});
exports.registerUser = registerUser;
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, supertest_1.default)(exports.app).post('/api/auth/login').send({ email, password });
});
exports.loginUser = loginUser;
const createUserAndGetToken = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (overrides = {}) {
    const user = Object.assign({ username: 'testuser', email: 'test@example.com', password: 'Password123' }, overrides);
    const res = yield (0, exports.registerUser)(user);
    if (res.status !== 201) {
        throw new Error(`Failed to register user: ${JSON.stringify(res.body)}`);
    }
    return {
        user: res.body.user,
        accessToken: res.body.accessToken,
        password: user.password,
    };
});
exports.createUserAndGetToken = createUserAndGetToken;
const createAdminAndGetToken = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (overrides = {}) {
    const { user, password } = yield (0, exports.createUserAndGetToken)(Object.assign({ username: 'admin', email: 'admin@example.com' }, overrides));
    const { User } = yield Promise.resolve().then(() => __importStar(require('../models/user.model')));
    yield User.update({ role: 'admin' }, { where: { id: user.id } });
    const login = yield (0, exports.loginUser)(user.email, password);
    return {
        user: login.body.user,
        accessToken: login.body.accessToken,
    };
});
exports.createAdminAndGetToken = createAdminAndGetToken;
