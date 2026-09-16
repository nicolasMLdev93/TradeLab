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
require("reflect-metadata");
require("dotenv/config");
process.env.NODE_ENV = 'test';
process.env.BCRYPT_ROUNDS = '4';
const database_1 = require("../config/database");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.sequelize.authenticate();
    yield database_1.sequelize.sync({ force: true });
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.sequelize.close();
}));
function afterAll(arg0) {
    throw new Error('Function not implemented.');
}
function beforeAll(arg0) {
    throw new Error('Function not implemented.');
}
