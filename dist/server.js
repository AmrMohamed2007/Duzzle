"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = require("express-rate-limit");
const helmet_1 = __importDefault(require("helmet"));
const main_1 = require("./server/main");
class Server {
    constructor(port) {
        this.env = {
            PORT: port,
            APP: (0, express_1.default)()
        };
        this.connection = undefined;
        this.limiter = (0, express_rate_limit_1.rateLimit)({
            windowMs: 15 * 60 * 1000,
            limit: 100,
            standardHeaders: 'draft-8',
            legacyHeaders: false,
        });
    }
    connectDb(URL) {
        const app = (0, main_1.connectDb)(URL);
        this.connection = app;
        return app;
    }
    start(options) {
        return new Promise((res, rej) => {
            this.env.APP.listen(this.env.PORT, () => {
                if (options && options.enableRateLimit) {
                    this.env.APP.use(this.limiter);
                }
                if (options && options.enableHelmet) {
                    this.env.APP.use((0, helmet_1.default)({
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
                    this.env.APP.use((0, helmet_1.default)());
                    this.env.APP.use(helmet_1.default.contentSecurityPolicy({
                        directives: {
                            defaultSrc: ["'self'"],
                            scriptSrc: ["'self'", "'trusted-scripts.example.com'"],
                            objectSrc: ["'none'"],
                            upgradeInsecureRequests: [],
                        },
                    }));
                    this.env.APP.use(helmet_1.default.frameguard({ action: 'deny' }));
                    this.env.APP.use(helmet_1.default.referrerPolicy({ policy: 'same-origin' }));
                    this.env.APP.use(helmet_1.default.hsts({
                        maxAge: 31536000,
                        includeSubDomains: true,
                        preload: true,
                    }));
                    this.env.APP.use(helmet_1.default.xssFilter());
                    this.env.APP.use(helmet_1.default.noSniff());
                    this.env.APP.use(helmet_1.default.dnsPrefetchControl({ allow: false }));
                    this.env.APP.use(helmet_1.default.permittedCrossDomainPolicies({ permittedPolicies: 'none' }));
                    this.env.APP.use(helmet_1.default.hidePoweredBy());
                    this.env.APP.use(helmet_1.default.ieNoOpen());
                }
                res();
            }).on('error', (err) => {
                rej(err);
            });
        });
    }
    use(middleware) {
        return this.env.APP.use(middleware);
    }
    all(path, middlewares, handler) {
        if (!handler.run)
            throw SyntaxError("run is required in handler");
        return Array.isArray(middlewares) && middlewares.length > 0 ? this.env.APP.all(path, middlewares, handler.run) : this.env.APP.all(path, handler.run);
    }
    get(path, middlewares, handler) {
        if (!handler.run)
            throw SyntaxError("run is required in handler");
        return Array.isArray(middlewares) && middlewares.length > 0 ? this.env.APP.get(path, middlewares, handler.run) : this.env.APP.get(path, handler.run);
    }
    put(path, middlewares, handler) {
        if (!handler.run)
            throw SyntaxError("run is required in handler");
        return Array.isArray(middlewares) && middlewares.length > 0 ? this.env.APP.put(path, middlewares, handler.run) : this.env.APP.put(path, handler.run);
    }
    delete(path, middlewares, handler) {
        if (!handler.run)
            throw SyntaxError("run is required in handler");
        return Array.isArray(middlewares) && middlewares.length > 0 ? this.env.APP.delete(path, middlewares, handler.run) : this.env.APP.delete(path, handler.run);
    }
    post(path, middlewares, handler) {
        if (!handler.run)
            throw SyntaxError("run is required in handler");
        return Array.isArray(middlewares) && middlewares.length > 0 ? this.env.APP.post(path, middlewares, handler.run) : this.env.APP.post(path, handler.run);
    }
    patch(path, middlewares, handler) {
        if (!handler.run)
            throw SyntaxError("run is required in handler");
        return Array.isArray(middlewares) && middlewares.length > 0 ? this.env.APP.patch(path, middlewares, handler.run) : this.env.APP.patch(path, handler.run);
    }
    router() {
        return express_1.default.Router();
    }
    useRouter(path, router) {
        this.env.APP.use(path, router);
    }
}
exports.Server = Server;
