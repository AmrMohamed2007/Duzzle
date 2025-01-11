import mongoose from "mongoose"
import { DBError } from "../utils/Error";
import { DBD } from "../utils/Success";
/**
 * Connects to the MongoDB database using the provided URL.
 *
 * @param url - The connection string for the MongoDB database.
 * @returns A promise that resolves to the Mongoose instance.
 * @throws An error if the connection fails, with the error message wrapped in a DBError.
 */

export async function connect(url: string): Promise<mongoose.Mongoose> {
    try {
        const client = await mongoose.connect(url)
        new DBD(undefined, "Connected to DB");
        return client;
    } catch (error: any) {
        const ErrorData = new DBError(error.message);
        throw new Error(ErrorData.message);

    }
}