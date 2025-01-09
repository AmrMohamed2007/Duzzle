
export interface ServerOptions {
    enable?: boolean;
    origin?: string;
    methods?: ["GET", "POST", "PUT", "DELETE", "PATCH"];
    allowedHeaders?: string[];
    exposedHeaders?: string;
    jsonLimit?: string;
    maxAge?: number;
    urlencoded?: string;
}