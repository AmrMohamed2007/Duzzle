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
exports.connect = connect;
const mongoose_1 = __importDefault(require("mongoose"));
const Error_1 = require("../utils/Error");
const Success_1 = require("../utils/Success");
/**
 * Connects to the MongoDB database using the provided URL.
 *
 * @param url - The connection string for the MongoDB database.
 * @returns A promise that resolves to the Mongoose instance.
 * @throws An error if the connection fails, with the error message wrapped in a DBError.
 */
function connect(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield mongoose_1.default.connect(url);
            new Success_1.DBD(undefined, "Connected to DB");
            return client;
        }
        catch (error) {
            const ErrorData = new Error_1.DBError(error.message);
            throw new Error(ErrorData.message);
        }
    });
}
