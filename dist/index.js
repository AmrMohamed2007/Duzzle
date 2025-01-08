"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = exports.App = exports.Shape = void 0;
const app_1 = require("./database/app");
Object.defineProperty(exports, "App", { enumerable: true, get: function () { return app_1.App; } });
const shape_1 = require("./database/Shape/shape");
Object.defineProperty(exports, "Shape", { enumerable: true, get: function () { return shape_1.Shape; } });
const server_1 = require("./http/server");
Object.defineProperty(exports, "Server", { enumerable: true, get: function () { return server_1.Server; } });
