"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const index_1 = __importDefault(require("./index"));
const PORT = Number(process.env.PORT);
const server = index_1.default.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
});
server.on("error", (error) => {
    console.error("✗ Failed to start server:", error);
    process.exit(1);
});
