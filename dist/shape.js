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
exports.Shape = void 0;
const ShapeFunctions_1 = require("./interfaces/ShapeFunctions");
const Error_1 = require("./utils/Error");
const NestedObject_1 = require("./utils/NestedObject");
class Shape {
    constructor(name, ModelData) {
        this.name = name;
        this.model = ModelData;
    }
    searchWI(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { type = ShapeFunctions_1.TOSN.one, key, value } = options;
            if (!type || !value) {
                const ErrorData = new Error_1.DBError("Invaild param was provided");
                throw new Error(ErrorData.message);
            }
            if (type == ShapeFunctions_1.TOSN.id) {
                return yield this.model.findById(value);
            }
            else if (type == ShapeFunctions_1.TOSN.one) {
                if (!key) {
                    const ErrorData = new Error_1.DBError("Invaild param was provided");
                    throw new Error(ErrorData.message);
                }
                return yield this.model.findOne({ [key]: value });
            }
            else if (type == ShapeFunctions_1.TOSN.all) {
                const QueryData = key && value ? { [key]: value } : {};
                return yield this.model.find(QueryData);
            }
            else {
                const ErrorData = new Error_1.DBError("Bad Type was provided");
                throw new Error(ErrorData.message);
            }
        });
    }
    editWI(filter, update, type, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, value } = filter;
            if (!key || !value || typeof key !== "string") {
                const ErrorData = new Error_1.DBError('Invalid param was provided "filter"');
                throw new Error(ErrorData.message);
            }
            try {
                if (type === ShapeFunctions_1.TOSU.one) {
                    if ("key" in update && "value" in update) {
                        const Ukey = update.key;
                        const arrOfD = Ukey.split(".");
                        const QueryData = (0, NestedObject_1.createNestedObject)(arrOfD, update.value, (options === null || options === void 0 ? void 0 : options.arrayMethod) ? options.arrayMethod : undefined);
                        const UpdateOption = { new: true, upsert: (options === null || options === void 0 ? void 0 : options.createNew) ? true : false };
                        return yield this.model.findOneAndUpdate(filter, QueryData, UpdateOption);
                    }
                    else if (typeof update === "object" && !Array.isArray(update)) {
                        const UpdateOption = { new: true, upsert: (options === null || options === void 0 ? void 0 : options.createNew) ? true : false };
                        return yield this.model.findOneAndUpdate(filter, update, UpdateOption);
                    }
                    else {
                        const ErrorData = new Error_1.DBError('Invalid param was provided "update"');
                        throw new Error(ErrorData.message);
                    }
                }
                else if (type === ShapeFunctions_1.TOSU.all) {
                    if ("key" in update && "value" in update) {
                        const Ukey = update.key;
                        const arrOfD = Ukey.split(".");
                        const QueryData = (0, NestedObject_1.createNestedObject)(arrOfD, update.value, (options === null || options === void 0 ? void 0 : options.arrayMethod) ? options.arrayMethod : undefined);
                        const UpdateOption = { new: true, upsert: (options === null || options === void 0 ? void 0 : options.createNew) ? true : false };
                        return yield this.model.updateMany(filter, QueryData, UpdateOption); // updateMany result is handled
                    }
                    else if (typeof update === "object" && !Array.isArray(update)) {
                        const UpdateOption = { new: true, upsert: (options === null || options === void 0 ? void 0 : options.createNew) ? true : false };
                        return yield this.model.updateMany(filter, update, UpdateOption); // updateMany result is handled
                    }
                    else {
                        const ErrorData = new Error_1.DBError('Invalid param was provided "update"');
                        throw new Error(ErrorData.message);
                    }
                }
                else {
                    const ErrorData = new Error_1.DBError('Invalid param was provided "type"');
                    throw new Error(ErrorData.message);
                }
            }
            catch (error) {
                const ErrorData = new Error_1.DBError(error.message);
                throw new Error(ErrorData.message);
            }
        });
    }
}
exports.Shape = Shape;
