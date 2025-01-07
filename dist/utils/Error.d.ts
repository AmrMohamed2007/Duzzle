declare class DBError extends Error {
    constructor(message: string);
    readonly message: string;
    readonly name: string;
}

