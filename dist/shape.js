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
const stream_1 = require("stream");
const Hash_1 = require("./utils/Hash");
class Shape extends stream_1.EventEmitter {
    constructor(name, ModelData, extentions) {
        super();
        this.name = name;
        this.model = ModelData;
        this.extentions = extentions ? extentions : undefined;
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
            var _a, _b, _c, _d, _e, _f, _g, _h;
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
                        const val = ((_b = (_a = this.extentions) === null || _a === void 0 ? void 0 : _a.autoHash) === null || _b === void 0 ? void 0 : _b.enable) ? yield (0, Hash_1.autoHash)(this.extentions, [{ [update.key]: update.value }]) : [{ [update.key]: update.value }];
                        const QueryData = yield (0, NestedObject_1.createNestedObject)(arrOfD, val[0][update.key], (options === null || options === void 0 ? void 0 : options.arrayMethod) ? options.arrayMethod : undefined);
                        const UpdateOption = { new: true, upsert: (options === null || options === void 0 ? void 0 : options.createNew) ? true : false };
                        const foau = yield this.model.findOneAndUpdate(filter, QueryData, UpdateOption);
                        this.emit("dbEdited", { data: foau, type: ShapeFunctions_1.TOSU.one });
                        return foau;
                    }
                    else if (typeof update === "object" && !Array.isArray(update)) {
                        const UpdateOption = { new: true, upsert: (options === null || options === void 0 ? void 0 : options.createNew) ? true : false };
                        const val = ((_d = (_c = this.extentions) === null || _c === void 0 ? void 0 : _c.autoHash) === null || _d === void 0 ? void 0 : _d.enable) ? yield (0, Hash_1.autoHash)(this.extentions, [update]) : [update];
                        const foau = yield this.model.findOneAndUpdate(filter, val[0], UpdateOption);
                        this.emit("dbEdited", { data: foau, type: ShapeFunctions_1.TOSU.one });
                        return foau;
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
                        const val = ((_f = (_e = this.extentions) === null || _e === void 0 ? void 0 : _e.autoHash) === null || _f === void 0 ? void 0 : _f.enable) ? yield (0, Hash_1.autoHash)(this.extentions, [{ [update.key]: update.value }]) : [{ [update.key]: update.value }];
                        const QueryData = (0, NestedObject_1.createNestedObject)(arrOfD, val[0][update.key], (options === null || options === void 0 ? void 0 : options.arrayMethod) ? options.arrayMethod : undefined);
                        const UpdateOption = { new: true, upsert: (options === null || options === void 0 ? void 0 : options.createNew) ? true : false };
                        this.emit("dbEdited", { type: ShapeFunctions_1.TOSU.all });
                        return yield this.model.updateMany(filter, QueryData, UpdateOption); // updateMany result is handled
                    }
                    else if (typeof update === "object" && !Array.isArray(update)) {
                        const val = ((_h = (_g = this.extentions) === null || _g === void 0 ? void 0 : _g.autoHash) === null || _h === void 0 ? void 0 : _h.enable) ? yield (0, Hash_1.autoHash)(this.extentions, [update]) : [update];
                        const UpdateOption = { new: true, upsert: (options === null || options === void 0 ? void 0 : options.createNew) ? true : false };
                        this.emit("dbEdited", { type: ShapeFunctions_1.TOSU.all });
                        return yield this.model.updateMany(filter, val[0], UpdateOption); // updateMany result is handled
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
    compareHash(hashedPassword, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, Hash_1.compareHash)(password, hashedPassword);
        });
    }
}
exports.Shape = Shape;
