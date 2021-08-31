"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isArrowFunction = exports.isFunction = exports.isPlainObject = void 0;
function isPlainObject(v) {
    return (!!v) && (v.constructor === Object);
}
exports.isPlainObject = isPlainObject;
function isFunction(v) {
    return !!(v && v.constructor && v.call && v.apply);
}
exports.isFunction = isFunction;
function isArrowFunction(v) {
    let native = v.toString().trim().endsWith('() { [native code] }');
    let plain = !native && v.hasOwnProperty('prototype');
    return isFunction(v) && !(native || plain);
}
exports.isArrowFunction = isArrowFunction;
