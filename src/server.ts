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

    constructor(port: number) {
        super();
        this.env = { PORT: port, APP: express() };
        this.connection = undefined;
        this.limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false });
    }

    connectDb(URL: string, options?: DatabaseOptions): App {
        this.connection = connectDb(URL, options);
        return this.connection;
    }
    async start(options: {
        enableRateLimit?: boolean; enableHelmet?: boolean; cors?: ServerOptions
    } = {
            enableRateLimit: false, enableHelmet: false, cors: {
                enable: false,
                origin: "*",
                methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
                jsonLimit: "512kb",
                maxAge: 3600,
                urlencoded: "512kb",
            }
        }): Promise<void> {
        return new Promise((resolve, reject) => {
            this.env.APP.listen(this.env.PORT, () => {
                if (options.enableRateLimit) this.env.APP.use(this.limiter);
                if (options.enableHelmet) this.env.APP.use(helmet());
                if (options.cors?.enable) this.configureMiddleware(options.cors);
                resolve();
            }).on('error', reject);
        });
    }

    private configureMiddleware(corsOptions: ServerOptions) {
        console.log(corsOptions);
        this.env.APP.use(cors({
            origin: corsOptions.origin || "*",
            methods: corsOptions.methods || "*",
            allowedHeaders: corsOptions.allowedHeaders || ["Content-Type", "Authorization", "X-Requested-With", "X-HTTP-Method-Override", "X-Forwarded-For", "X-Real-IP", "X-Forwarded-Proto", "X-Forwarded-Host", "X-Forwarded-Port", "X-Forwarded-Server", "X-Forwarded-For", "X-Forwarded-Host", "X-Forwarded-Port", "X-Forwarded-Server", "X-Forwarded-Proto", "X-Real-IP", "X-Requested-With", "Accept", "Origin", "X-HTTP-Method-Override"],
            exposedHeaders: corsOptions.allowedHeaders || ["Content-Type", "Authorization", "X-Requested-With", "X-HTTP-Method-Override", "X-Forwarded-For", "X-Real-IP", "X-Forwarded-Proto", "X-Forwarded-Host", "X-Forwarded-Port", "X-Forwarded-Server", "X-Forwarded-For", "X-Forwarded-Host", "X-Forwarded-Port", "X-Forwarded-Server", "X-Forwarded-Proto", "X-Real-IP", "X-Requested-With", "Accept", "Origin", "X-HTTP-Method-Override"],
            maxAge: 3600,
        }));
        this.env.APP.use(express.json({ limit: corsOptions.jsonLimit || "512kb" }));
        this.env.APP.use(express.urlencoded({ extended: true, limit: corsOptions.urlencoded || "512kb" }));
    }

    private handleRoute(method: keyof Application, path: string, middlewares: RequestHandler[], handler: RouteHandler): void {
        if (!handler.run) throw new SyntaxError("Handler must implement a 'run' method");
        this.env.APP[method](path, [...middlewares, handler.run]);
    }

    public use(middleware: RequestHandler): Application {
        return this.env.APP.use(middleware);
    }

    public all(path: string, middlewares: RequestHandler[], handler: RouteHandler): void {
        this.handleRoute('all', path, middlewares, handler);
    }

    public get(path: string, middlewares: RequestHandler[], handler: RouteHandler): void {
        this.handleRoute('get', path, middlewares, handler);
    }

    public put(path: string, middlewares: RequestHandler[], handler: RouteHandler): void {
        this.handleRoute('put', path, middlewares, handler);
    }

    public delete(path: string, middlewares: RequestHandler[], handler: RouteHandler): void {
        this.handleRoute('delete', path, middlewares, handler);
    }

    public post(path: string, middlewares: RequestHandler[], handler: RouteHandler): void {
        this.handleRoute('post', path, middlewares, handler);
    }

    public patch(path: string, middlewares: RequestHandler[], handler: RouteHandler): void {
        this.handleRoute('patch', path, middlewares, handler);
    }

    public Router(): Router {
        return express.Router();
    }

    public useRouter(path: string, router: Router): void {
        this.env.APP.use(path, router);
    }
}
