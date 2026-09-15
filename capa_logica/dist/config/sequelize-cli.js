"use strict";
var _a;
require("dotenv/config");
const config = {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: Number((_a = process.env.DB_PORT) !== null && _a !== void 0 ? _a : 3306),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
};
module.exports = config;
