export class DBD {
    constructor(name: string = "DBSuccess", message: string) {
        console.log(`[${name}]: ${message}`);
        return {message, name}
    }
}