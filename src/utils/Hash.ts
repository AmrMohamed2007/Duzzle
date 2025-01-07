import bcrypt from "bcrypt"
import { DBError } from "./Error"
import { DatabaseOptions } from "src/interfaces/Database"
export const autoHash = async (DatabaseOptions: DatabaseOptions | undefined, data: any[]): Promise<any[] | undefined> => {
    if(!DatabaseOptions) return;
    if (DatabaseOptions.autoHash?.enable && DatabaseOptions.autoHash?.words && DatabaseOptions.autoHash?.words.length > 0) {
        if (!Array.isArray(data)) {
            const ErrorData = new DBError("data is not array")
            throw new Error(ErrorData.message)
        } else {
            console.log(data, 'dataaa',DatabaseOptions, DatabaseOptions.autoHash.words);
            
            const hashedPassword = data.map(async m => {
                console.log(m, "cluded");
                const ObjectK = Object.keys(m)[0]
                if (DatabaseOptions.autoHash?.words.includes(ObjectK)) {
                    console.log(m, "mincluded");
                    
                    return await bcrypt.hash(m, 10)
                }
                console.log(m, "cludedsss");
                return m;

            })
            return (await Promise.all(hashedPassword)).filter(m => m) as string[]
        }
    }
    return undefined

}

export const compareHash = async (password: string, hash: string): Promise<boolean> => {
    try {
        const result = await bcrypt.compare(password, hash)
        return result
    } catch (error: any) {
        throw new Error(error.message)
    }
}
