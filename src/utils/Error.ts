export class DBError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DBError';
        console.error(`[DBError]: ${message}`);
        return {message, name: this.name}
    
    }

   
}

