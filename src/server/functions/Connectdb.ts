import { App } from "../../index"

export const connectDb = (URL: string) => {
    try {


        if (!URL) throw new Error("DB URL is not provided");
        const ApplicationDB = new App(URL)
        ApplicationDB.connect()
        return ApplicationDB;
    } catch (error: any) {
        throw new Error(error.message);
    }
}