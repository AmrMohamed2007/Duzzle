import { EventEmitter } from 'events';
import { Mongoose, Document, Model, UpdateWriteOpResult } from "mongoose";
import { Application, Request, Response, RequestHandler, Router } from "express";


declare namespace Duzzle {
    // Types
    export type RouteHandler = { run: (req: Request, res: Response) => void };

    // Interfaces
    export interface DatabaseOptions {
        autoHash?: {
            enable: boolean;
            words: string[];
        };
    }

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

    export interface Query {
        key?: string;
        value: any;
        type: TOSN;
    }

    export interface QueryU {
        key?: string;
        value: any;
    }

    export interface QueryUpdate {
        key: string;
        value: any;
    }

    export interface Uptions {
        createNew?: boolean;
        arrayMethod?: "push" | "pop" | "set";
    }

    export interface ShapeAdd {
        name: string;
        SchemaData: Record<string, unknown>;
    }

    // Enums
    export enum TOSU {
        all = 0,
        one = 1,
    }

    export enum TOSN {
        all = 0,
        one = 1,
        id = 2,
    }

    // Classes
    export class App extends EventEmitter {
        constructor(url: string, extensions: DatabaseOptions);
        public url: string;
        public connected: boolean;
        public db: Mongoose | undefined;
        public extensions?: DatabaseOptions;
        public Shapes: Record<string, Shape>;

        public RunNotes(): void;
        public connect(): Promise<void | Mongoose>;
        public disconnect(): Promise<void>;
        public createShape(options: ShapeAdd): Promise<Shape>;
    }

    export class Server extends EventEmitter {
        public env: { PORT: number; APP: Application };
        public connection: App | undefined;
        private limiter: RequestHandler;

        constructor(port: number);

        public connectDb(URL: string, options?: DatabaseOptions): App;

        public start(options?: {
            enableRateLimit: boolean;
            enableHelmet: boolean;
            cors: ServerOptions;
        }): Promise<void>;

        private configureMiddleware(corsOptions: ServerOptions): void;

        private handleRoute(
            method: keyof Application,
            path: string,
            middlewares: RequestHandler[],
            handler: RouteHandler
        ): void;

        public use(middleware: RequestHandler): Application;

        public all(path: string, middlewares: RequestHandler[], handler: RouteHandler): void;

        public get(path: string, middlewares: RequestHandler[], handler: RouteHandler): void;

        public put(path: string, middlewares: RequestHandler[], handler: RouteHandler): void;

        public delete(path: string, middlewares: RequestHandler[], handler: RouteHandler): void;

        public post(path: string, middlewares: RequestHandler[], handler: RouteHandler): void;

        public patch(path: string, middlewares: RequestHandler[], handler: RouteHandler): void;

        public Router(): Router;

        public useRouter(path: string, router: Router): void;
    }

    export class Shape extends EventEmitter {
        constructor(name: string, ModelData: Model<any>, extension: DatabaseOptions | undefined);
        public name: string;
        public model: Model<any>;

        public searchWI(options: Query): Promise<
            Document<unknown, any, unknown> | Document<unknown, any, unknown>[] | undefined | null
        >;

        public editWI(
            filter: QueryU,
            update: QueryUpdate | Record<string, unknown>,
            type: TOSU,
            options?: Uptions
        ): Promise<
            | Document<unknown, any, unknown>
            | Document<unknown, any, unknown>[]
            | UpdateWriteOpResult
            | undefined
            | null
        >;

        public compareHash(hashedPassword: string, password: string): Promise<boolean>;
    }
}

export = Duzzle;
