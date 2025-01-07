"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = void 0;
const index_1 = require("../../index");
const connectDb = (URL) => {
    if (!URL)
        throw new Error("DB URL is not provided");
    return new index_1.App(URL);
};
exports.connectDb = connectDb;
