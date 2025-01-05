import mongoose, { Model, Schema } from "mongoose"
import { DBError } from "src/utils/Error";
import { DBD } from "src/utils/Success";
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


