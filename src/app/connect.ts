import mongoose from "mongoose"
import { DBError } from "src/utils/Error";
import { DBD } from "src/utils/Success";
export async function connect(url: string): Promise<undefined> {
    try {


        await mongoose.connect(url)
        new DBD(undefined, "Connected to DB");

    } catch (error: any) {
        new DBError(`${error.message}`)

    }

}

