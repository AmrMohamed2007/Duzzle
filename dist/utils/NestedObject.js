"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNestedObject = createNestedObject;
function createNestedObject(keys, value, arrayMethod) {
    let result = {};
    let current = result;
    keys.forEach((key, index) => {
        if (index === keys.length - 1) {
            current[key] = { [arrayMethod ? `$${arrayMethod}` : "set"]: value };
        }
        else {
            current[key] = {};
            current = current[key];
        }
    });
    return result;
}
