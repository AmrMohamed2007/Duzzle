"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = void 0;
const index_1 = require("../../index");
const connectDb = (URL) => {
    try {
        if (!URL)
            throw new Error("DB URL is not provided");
        const ApplicationDB = new index_1.App(URL);
        ApplicationDB.connect();
        return ApplicationDB;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.connectDb = connectDb;
