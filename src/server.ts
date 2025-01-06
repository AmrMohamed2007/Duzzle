import express, { Application, Request, Response, NextFunction, RequestHandler, Router } from "express";
import { rateLimit } from "express-rate-limit";
import Helmet from "helmet";
import { App } from "./index"

type RouteHandler = {
    run: (req: Request, res: Response) => void;
};

export class Server {
    public env: any;
    public connection: App | undefined | any;
    private limiter;

    constructor(port: number) {
        this.env = {
            PORT: port,
            APP: express()
        }

        this.connection = undefined;

        this.limiter = rateLimit({
            windowMs: 15 * 60 * 1000,
            limit: 100,
            standardHeaders: 'draft-8',
            legacyHeaders: false,
        })
    }


    connectDb(URL: string) {
        const app = new App(URL)
        app.connect().then(() => {
            console.log('Connected to the database!');
        }).catch(err => {
            console.error('Failed to connect to the database:', err);
        });
        
        this.connection = app
        return app
    }

    start(options?: { enableRateLimit?: boolean, enableHelmet?: boolean }): Promise<void> {
        return new Promise((res, rej) => {
            this.env.APP.listen(this.env.PORT, () => {
                if (options && options.enableRateLimit) {
                    this.env.APP.use(this.limiter)
                }
                if (options && options.enableHelmet) {
                    this.env.APP.use(Helmet({
                        contentSecurityPolicy: {
                            directives: {
                                defaultSrc: ["'self'"],
                                scriptSrc: ["'self'", "'trusted-scripts.example.com'"],
                                objectSrc: ["'none'"],
                                upgradeInsecureRequests: [],
                            },
                        },
                        frameguard: {
                            action: 'deny',
                        },
                        referrerPolicy: {
                            policy: 'no-referrer',
                        },
                        hsts: {
                            maxAge: 31536000,
                            includeSubDomains: true,
                            preload: true,
                        },
                        xssFilter: true,
                        noSniff: true,
                        dnsPrefetchControl: {
                            allow: false,
                        },
                        hidePoweredBy: true,
                    }));

                    this.env.APP.use(Helmet());
                    this.env.APP.use(Helmet.contentSecurityPolicy({
                        directives: {
                            defaultSrc: ["'self'"],
                            scriptSrc: ["'self'", "'trusted-scripts.example.com'"],
                            objectSrc: ["'none'"],
                            upgradeInsecureRequests: [],
                        },
                    }));
                    this.env.APP.use(Helmet.frameguard({ action: 'deny' }));
                    this.env.APP.use(Helmet.referrerPolicy({ policy: 'same-origin' }));
                    this.env.APP.use(Helmet.hsts({
                        maxAge: 31536000,
                        includeSubDomains: true,
                        preload: true,
                    }));
                    this.env.APP.use(Helmet.xssFilter());
                    this.env.APP.use(Helmet.noSniff());
                    this.env.APP.use(Helmet.dnsPrefetchControl({ allow: false }));
                    this.env.APP.use(Helmet.permittedCrossDomainPolicies({ permittedPolicies: 'none' }));
                    this.env.APP.use(Helmet.hidePoweredBy());
                    this.env.APP.use(Helmet.ieNoOpen());
                }
                res();
            }).on('error', (err: Error) => {
                rej(err);
            });
        });
    }

    use(middleware: RequestHandler) {
        return this.env.APP.use(middleware);
    }

    all(path: string, middlewares: RequestHandler[], handler: RouteHandler) {
        if (!handler.run)
            throw SyntaxError("run is required in handler");
        return Array.isArray(middlewares) && middlewares.length > 0 ? this.env.APP.all(path, middlewares, handler.run) : this.env.APP.all(path, handler.run);
    }

    get(path: string, middlewares: RequestHandler[], handler: RouteHandler) {
        if (!handler.run)
            throw SyntaxError("run is required in handler");
        return Array.isArray(middlewares) && middlewares.length > 0 ? this.env.APP.get(path, middlewares, handler.run) : this.env.APP.get(path, handler.run);
    }

    put(path: string, middlewares: RequestHandler[], handler: RouteHandler) {
        if (!handler.run)
            throw SyntaxError("run is required in handler");
        return Array.isArray(middlewares) && middlewares.length > 0 ? this.env.APP.put(path, middlewares, handler.run) : this.env.APP.put(path, handler.run);
    }

    delete(path: string, middlewares: RequestHandler[], handler: RouteHandler) {
        if (!handler.run)
            throw SyntaxError("run is required in handler");
        return Array.isArray(middlewares) && middlewares.length > 0 ? this.env.APP.delete(path, middlewares, handler.run) : this.env.APP.delete(path, handler.run);
    }

    post(path: string, middlewares: RequestHandler[], handler: RouteHandler) {
        if (!handler.run)
            throw SyntaxError("run is required in handler");
        return Array.isArray(middlewares) && middlewares.length > 0 ? this.env.APP.post(path, middlewares, handler.run) : this.env.APP.post(path, handler.run);
    }

    patch(path: string, middlewares: RequestHandler[], handler: RouteHandler) {
        if (!handler.run)
            throw SyntaxError("run is required in handler");
        return Array.isArray(middlewares) && middlewares.length > 0 ? this.env.APP.patch(path, middlewares, handler.run) : this.env.APP.patch(path, handler.run);
    }

    router(): Router {
        return express.Router()
    }

    useRouter(path: string, router: Router) {
        this.env.APP.use(path, router);
    }
}
