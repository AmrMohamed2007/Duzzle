"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNestedObject = createNestedObject;
function createNestedObject(keys, value, arrayMethod) {
    let result = {};
    let current = result;
    console.log(arrayMethod, value, keys);
    keys.forEach((key, index) => {
        if (index === keys.length - 1) {
            current[key] = arrayMethod ? { [arrayMethod ? `$${arrayMethod}` : "set"]: value } : value;
        }
        else {
            current[key] = {};
            current = current[key];
        }
    });
    console.log(result);
    return result;
}
