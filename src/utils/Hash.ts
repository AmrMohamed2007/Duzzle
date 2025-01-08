import bcrypt from "bcrypt"
import { DBError } from "./Error"
import { DatabaseOptions } from "src/interfaces/Database"

export const autoHash = async (DatabaseOptions: DatabaseOptions | undefined, data: any[]): Promise<any[] | undefined> => {
    if (!DatabaseOptions) return;
    if (DatabaseOptions.autoHash?.enable && DatabaseOptions.autoHash?.words && DatabaseOptions.autoHash?.words.length > 0) {
        if (!Array.isArray(data)) {
            throw new Error(new DBError("data is not array").message);
        } else {
            const hashedPassword = data.map(async m => {
                const ObjectK = Object.entries(m)[0];
             
                
                if (DatabaseOptions.autoHash?.words.includes(ObjectK[0])) {
                    const value = ObjectK[1];
                    if (typeof value !== "string" && !Buffer.isBuffer(value)) {
                        throw new Error("Value to hash must be a string or Buffer");
                    } 
                    const hash = await bcrypt.hash(value, 10);
                    return { [ObjectK[0]]: hash };
                }
                return m;
            });
            return (await Promise.all(hashedPassword)).filter(m => m) as any[];
        }
    }
    return undefined;
}

export const compareHash = async (password: string, hash: string): Promise<boolean> => {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error: any) {
        throw new Error(error.message);
    }
}

