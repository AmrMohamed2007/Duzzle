/**
 * Represents the server class which extends EventEmitter.
 */
export class Server extends EventEmitter {
    /**
     * The environment configuration containing the port and the Express application instance.
     */
    public env: { PORT: number; APP: Application };

    /**
     * The database connection instance.
     */
    public connection: App | undefined;

    /**
     * The rate limiter middleware.
     */
    private limiter: RequestHandler;

    /**
     * Creates an instance of the Server class.
     * @param port - The port number on which the server will listen.
     */
    constructor(port: number) {
        super();
        this.env = { PORT: port, APP: express() };
        this.connection = undefined;
        this.limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false });
    }

    /**
     * Connects to the database.
     * @param URL - The database connection URL.
     * @param options - Optional database connection options.
     * @returns The database connection instance.
     */
    connectDb(URL: string, options?: DatabaseOptions): App {
        this.connection = connectDb(URL, options);
        return this.connection;
    }

    /**
     * Starts the server with the given options.
     * @param options - The server options including rate limiting, helmet, and CORS configuration.
     * @returns A promise that resolves when the server starts successfully.
     */
    async start(options: {
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

    /**
        // console.log(corsOptions);
        this.env.APP.use(cors({
            origin: corsOptions.origin || "*",
            methods: corsOptions.methods || "*",
            allowedHeaders: corsOptions.allowedHeaders || ["Content-Type", "Authorization", "X-Requested-With", "X-HTTP-Method-Override", "X-Forwarded-For", "X-Real-IP", "X-Forwarded-Proto", "X-Forwarded-Host", "X-Forwarded-Port", "X-Forwarded-Server", "X-Forwarded-For", "X-Forwarded-Host", "X-Forwarded-Port", "X-Forwarded-Server", "X-Forwarded-Proto", "X-Real-IP", "X-Requested-With", "Accept", "Origin", "X-HTTP-Method-Override"],
            exposedHeaders: corsOptions.allowedHeaders || ["Content-Type", "Authorization", "X-Requested-With", "X-HTTP-Method-Override", "X-Forwarded-For", "X-Real-IP", "X-Forwarded-Proto", "X-Forwarded-Host", "X-Forwarded-Port", "X-Forwarded-Server", "X-Forwarded-For", "X-Forwarded-Host", "X-Forwarded-Port", "X-Forwarded-Server", "X-Forwarded-Proto", "X-Real-IP", "X-Requested-With", "Accept", "Origin", "X-HTTP-Method-Override"],
            maxAge: 3600,
        }));
        this.env.APP.use(express.json({ limit: corsOptions.jsonLimit || "36kb" }));
        this.env.APP.use(express.urlencoded({ extended: true, limit: corsOptions.urlencoded || "36kb" }));
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
