declare module "duzzle" {
    import express, { Application, Request, Response, RequestHandler, Router } from "express";
    import helmet from "helmet";
    import cors from "cors";
    import { rateLimit } from "express-rate-limit";
    import { App } from "./index";
    import { connectDb } from "./server/main";
    import { EventEmitter } from 'events';
    import { DatabaseOptions } from "./interfaces/Database";
    import { ServerOptions } from "./interfaces/serve";

    type RouteHandler = { run: (req: Request, res: Response) => void };

    export class Server extends EventEmitter {
        public env: { PORT: number; APP: Application };
        public connection: App | undefined;
        private limiter: RequestHandler;

        constructor(port: number);

        connectDb(URL: string, options?: DatabaseOptions): App;

        start(options: {
            enableRateLimit: boolean; enableHelmet: boolean; cors: ServerOptions
        } = {
                enableRateLimit: false, enableHelmet: false, cors: {
                    enable: false,
                    origin: "*",
                    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
                    jsonLimit: "36kb",
                    maxAge: 3600,
                    urlencoded: "36kb",
                }
            }): Promise<void>;

        private configureMiddleware(corsOptions: ServerOptions): void;

        private handleRoute(method: keyof Application, path: string, middlewares: RequestHandler[], handler: RouteHandler): void;

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
}
