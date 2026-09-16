"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.name = 'HttpError';
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.HttpError = HttpError;
