"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = require("express-rate-limit");
const main_1 = require("./server/main");
const events_1 = require("events");
class Server extends events_1.EventEmitter {
    constructor(port) {
        super();
        this.env = { PORT: port, APP: (0, express_1.default)() };
        this.connection = undefined;
        this.limiter = (0, express_rate_limit_1.rateLimit)({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false });
    }
    connectDb(URL, options) {
        this.connection = (0, main_1.connectDb)(URL, options);
        return this.connection;
    }
    start() {
        return __awaiter(this, arguments, void 0, function* (options = {
            enableRateLimit: false, enableHelmet: false, cors: {
                enable: false,
                origin: "*",
                methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
                jsonLimit: "512kb",
                maxAge: 3600,
                urlencoded: "512kb",
            }
        }) {
            return new Promise((resolve, reject) => {
                this.env.APP.listen(this.env.PORT, () => {
                    var _a;
                    if (options.enableRateLimit)
                        this.env.APP.use(this.limiter);
                    if (options.enableHelmet)
                        this.env.APP.use((0, helmet_1.default)());
                    if ((_a = options.cors) === null || _a === void 0 ? void 0 : _a.enable)
                        this.configureMiddleware(options.cors);
                    resolve();
                }).on('error', reject);
            });
        });
    }
    configureMiddleware(corsOptions) {
        console.log(corsOptions);
        this.env.APP.use((0, cors_1.default)({
            origin: corsOptions.origin || "*",
            methods: corsOptions.methods || "*",
            allowedHeaders: corsOptions.allowedHeaders || ["Content-Type", "Authorization", "X-Requested-With", "X-HTTP-Method-Override", "X-Forwarded-For", "X-Real-IP", "X-Forwarded-Proto", "X-Forwarded-Host", "X-Forwarded-Port", "X-Forwarded-Server", "X-Forwarded-For", "X-Forwarded-Host", "X-Forwarded-Port", "X-Forwarded-Server", "X-Forwarded-Proto", "X-Real-IP", "X-Requested-With", "Accept", "Origin", "X-HTTP-Method-Override"],
            exposedHeaders: corsOptions.allowedHeaders || ["Content-Type", "Authorization", "X-Requested-With", "X-HTTP-Method-Override", "X-Forwarded-For", "X-Real-IP", "X-Forwarded-Proto", "X-Forwarded-Host", "X-Forwarded-Port", "X-Forwarded-Server", "X-Forwarded-For", "X-Forwarded-Host", "X-Forwarded-Port", "X-Forwarded-Server", "X-Forwarded-Proto", "X-Real-IP", "X-Requested-With", "Accept", "Origin", "X-HTTP-Method-Override"],
            maxAge: 3600,
        }));
        this.env.APP.use(express_1.default.json({ limit: corsOptions.jsonLimit || "512kb" }));
        this.env.APP.use(express_1.default.urlencoded({ extended: true, limit: corsOptions.urlencoded || "512kb" }));
    }
    handleRoute(method, path, middlewares, handler) {
        if (!handler.run)
            throw new SyntaxError("Handler must implement a 'run' method");
        this.env.APP[method](path, [...middlewares, handler.run]);
    }
    use(middleware) {
        return this.env.APP.use(middleware);
    }
    all(path, middlewares, handler) {
        this.handleRoute('all', path, middlewares, handler);
    }
    get(path, middlewares, handler) {
        this.handleRoute('get', path, middlewares, handler);
    }
    put(path, middlewares, handler) {
        this.handleRoute('put', path, middlewares, handler);
    }
    delete(path, middlewares, handler) {
        this.handleRoute('delete', path, middlewares, handler);
    }
    post(path, middlewares, handler) {
        this.handleRoute('post', path, middlewares, handler);
    }
    patch(path, middlewares, handler) {
        this.handleRoute('patch', path, middlewares, handler);
    }
    Router() {
        return express_1.default.Router();
    }
    useRouter(path, router) {
        this.env.APP.use(path, router);
    }
}
exports.Server = Server;
