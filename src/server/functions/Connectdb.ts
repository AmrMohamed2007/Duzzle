import { App } from "../../index"

export const connectDb = (URL: string) => {
    if(!URL) throw new Error("DB URL is not provided");
    return new App(URL);
}