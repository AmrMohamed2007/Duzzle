import { DatabaseOptions } from "src/interfaces/Database";
import { App } from "../../index"

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