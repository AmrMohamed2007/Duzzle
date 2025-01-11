import mongoose, { Model, Schema } from "mongoose"
import { DBError } from "../../utils/Error";
import { DBD } from "../../utils/Success";
/**
 * @fileoverview This file contains the function to create a schema in the database.
 */

/**
 * Creates a schema in the database with the given name and data.
 *
 * @param {Object} params - The parameters for creating the schema.
 * @param {string} params.name - The name of the schema.
 * @param {Record<string, unknown>} params.data - The data for the schema.
 * @returns {Promise<Model<any>>} - A promise that resolves to the created schema model.
 * @throws {Error} - Throws an error if the name is not a string or if there is an error during schema creation.
 */

export async function createSch({ name, data }: { name: string, data: Record<string, unknown> }): Promise<Model<any>> {
    try {
        if (typeof name !== "string") {
            const ErrorData = new DBError("Error name or schema data not provided");
            throw new Error(ErrorData.message);
        }
        const schema = new Schema(data);
        const modelSchema = mongoose.model(name, schema)
      
        new DBD(undefined, `Schema Created With Name : ${name}`);
        return modelSchema
    } catch (error: any) {
        const ErrorData = new DBError(error.message);
        throw new Error(ErrorData.message);

    }
}