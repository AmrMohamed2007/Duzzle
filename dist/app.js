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
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const events_1 = require("events");
const connect_1 = require("./app/connect");
const mongoose_1 = require("mongoose");
const Error_1 = require("./utils/Error");
const create_1 = require("./app/Schema/create");
const shape_1 = require("./shape");
const Colors_1 = require("./utils/Colors");
class App extends events_1.EventEmitter {
    constructor(url, extentions) {
        super();
        this.url = url;
        this.connected = false;
        this.db = undefined;
        this.Shapes = {};
        this.extentions = extentions ? extentions : undefined;
    }
    RunNotes() {
        console.log((0, Colors_1.color)("This Package Maked by https://www.youtube.com/@amrmohm", "#2ef306"));
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.RunNotes();
            const Mongoose = yield (0, connect_1.connect)(this.url);
            if (!Mongoose || typeof Mongoose == "boolean") {
                return Promise.reject(new Error_1.DBError("Mongoose is not connected"));
            }
            this.db = Mongoose;
            this.connected = true;
            this.emit("dbConnected", { url: this.url, db: Mongoose });
            return Promise.resolve(Mongoose);
        });
    }
    disconnect() {
        var _a;
        if (this.connected) {
            (_a = this.db) === null || _a === void 0 ? void 0 : _a.disconnect();
            this.connected = false;
            return Promise.resolve();
        }
        return Promise.reject(new Error_1.DBError("Mongoose is not connected"));
    }
    createShape(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!options || !options.SchemaData || !options.name) {
                const ErrorData = new Error_1.DBError("Error name or schema data not provided");
                throw new Error(ErrorData.message);
            }
            if (typeof options.name !== "string" || options.SchemaData instanceof mongoose_1.Model) {
                const ErrorData = new Error_1.DBError("Error name or schema data true type does not provided");
                throw new Error(ErrorData.message);
            }
            if (!this.connected) {
                const ErrorData = new Error_1.DBError("db is not connected to make a shape");
                throw new Error(ErrorData.message);
            }
            const Schema = yield (0, create_1.createSch)({ name: options.name, data: options.SchemaData });
            const newShape = new shape_1.Shape(options.name, Schema, this.extentions);
            this.Shapes[options.name] = newShape;
            return newShape;
        });
    }
}
exports.App = App;
