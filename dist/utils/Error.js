"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBError = void 0;
class DBError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DBError';
        console.error(`[DBError]: ${message}`);
        return { message, name: this.name };
    }
}
exports.DBError = DBError;
