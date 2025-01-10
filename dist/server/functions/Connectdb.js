"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = void 0;
const index_1 = require("../../index");
/**
 * Connects to the database using the provided URL and optional extensions.
 *
 * @param {string} URL - The URL of the database to connect to.
 * @param {DatabaseOptions} [extentions] - Optional database configuration options.
 * @returns {App} The connected database application instance.
 * @throws {Error} If the URL is not provided or if there is an error during connection.
 */
const connectDb = (URL, extentions) => {
    try {
        if (!URL)
            throw new Error("DB URL is not provided");
        const ApplicationDB = new index_1.App(URL, extentions);
        ApplicationDB.connect();
        return ApplicationDB;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.connectDb = connectDb;
