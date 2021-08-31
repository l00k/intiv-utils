"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PropertyDescriptor {
    constructor(options = {}) {
        this.populate = true;
        this.preserveRaw = false;
        this.type = options.type ? options.type : this.type;
        this.arrayOf = options.arrayOf ? options.arrayOf : this.arrayOf;
    }
    get isPrimitive() {
        return [Boolean, null, undefined, Number, BigInt, String, Symbol].indexOf(this.type) !== -1;
    }
    get isArray() {
        return this.arrayOf !== undefined;
    }
    get isDate() {
        return this.type === Date;
    }
}
exports.default = PropertyDescriptor;
