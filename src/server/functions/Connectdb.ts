import { DatabaseOptions } from "../../../index";
import { App } from "../../index"

/**
 * Connects to the database using the provided URL and optional extensions.
 *
 * @param {string} URL - The URL of the database to connect to.
 * @param {DatabaseOptions} [extentions] - Optional database configuration options.
 * @returns {App} The connected database application instance.
 * @throws {Error} If the URL is not provided or if there is an error during connection.
 */

export const connectDb = (URL: string, extentions?: DatabaseOptions) => {
    try {
        if (!URL) throw new Error("DB URL is not provided");
        const ApplicationDB = new App(URL, extentions)
        ApplicationDB.connect()
        return ApplicationDB;
    } catch (error: any) {
        throw new Error(error.message);
    }
}