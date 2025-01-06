"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBD = void 0;
class DBD {
    constructor(name = "DBSuccess", message) {
        console.error(`[${name}]: ${message}`);
        return { message, name };
    }
}
exports.DBD = DBD;
