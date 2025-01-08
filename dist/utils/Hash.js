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
exports.compareHash = exports.autoHash = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const Error_1 = require("./Error");
const autoHash = (DatabaseOptions, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (!DatabaseOptions)
        return;
    if (((_a = DatabaseOptions.autoHash) === null || _a === void 0 ? void 0 : _a.enable) && ((_b = DatabaseOptions.autoHash) === null || _b === void 0 ? void 0 : _b.words) && ((_c = DatabaseOptions.autoHash) === null || _c === void 0 ? void 0 : _c.words.length) > 0) {
        if (!Array.isArray(data)) {
            throw new Error(new Error_1.DBError("data is not array").message);
        }
        else {
            const hashedPassword = data.map((m) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                const ObjectK = Object.entries(m)[0];
                if ((_a = DatabaseOptions.autoHash) === null || _a === void 0 ? void 0 : _a.words.includes(ObjectK[0])) {
                    const value = ObjectK[1];
                    if (typeof value !== "string" && !Buffer.isBuffer(value)) {
                        throw new Error("Value to hash must be a string or Buffer");
                    }
                    const hash = yield bcrypt_1.default.hash(value, 10);
                    return { [ObjectK[0]]: hash };
                }
                return m;
            }));
            return (yield Promise.all(hashedPassword)).filter(m => m);
        }
    }
    return undefined;
});
exports.autoHash = autoHash;
const compareHash = (password, hash) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield bcrypt_1.default.compare(password, hash);
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.compareHash = compareHash;
