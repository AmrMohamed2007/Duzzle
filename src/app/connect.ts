import mongoose from "mongoose"
import { DBError } from "src/utils/Error";
import { DBD } from "src/utils/Success";
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

