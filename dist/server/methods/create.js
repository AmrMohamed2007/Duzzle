"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.method = method;
function method(app, method, path) {
    app[method](path, (req, res) => {
    });
}
