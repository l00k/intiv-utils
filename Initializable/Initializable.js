"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const def_1 = require("./def");
const PropertyDescriptor_1 = tslib_1.__importDefault(require("./PropertyDescriptor"));
class Initializable {
    constructor(data) {
    }
    setData(data) {
        if (!data) {
            return;
        }
        const Target = Object.getPrototypeOf(this);
        const mapping = Target[def_1.MappingSymbol] || {};
        const properties = Target[def_1.PropertySymbol] || {};
        Object.entries(data)
            .forEach(([fieldName, rawValue]) => {
            const property = mapping[fieldName]
                ? mapping[fieldName]
                : fieldName;
            let propertyDsrp = properties[property];
            if (!propertyDsrp) {
                propertyDsrp = new PropertyDescriptor_1.default({ preserveRaw: true });
            }
            // population blocked
            if (!propertyDsrp.populate) {
                return;
            }
            if (rawValue === undefined || rawValue === null) {
                this[property] = rawValue;
            }
            else if (propertyDsrp.preserveRaw) {
                this[property] = rawValue;
            }
            else if (propertyDsrp.isPrimitive) {
                this[property] = this._parseRawValue(propertyDsrp, rawValue);
            }
            else if (propertyDsrp.isArray) {
                this[property] = [];
                if (rawValue instanceof Array) {
                    rawValue.forEach((elm) => {
                        const subElm = this._parseRawValue(propertyDsrp, elm);
                        this[property].push(subElm);
                    });
                }
                else if (typeof rawValue == 'object') {
                    Object.keys(rawValue)
                        .forEach((idx) => {
                        const subElm = this._parseRawValue(propertyDsrp, rawValue[idx]);
                        this[property].push(subElm);
                    });
                }
            }
            else {
                this[property] = this._parseRawValue(propertyDsrp, rawValue);
            }
        });
    }
    _parseRawValue(propertyDsrp, rawValue) {
        const type = propertyDsrp.arrayOf || propertyDsrp.type;
        if (rawValue === undefined || rawValue === null) {
            return rawValue;
        }
        else if (!type) {
            return rawValue;
        }
        else if (rawValue instanceof type) {
            return rawValue;
        }
        else if (type === Boolean) {
            return !!rawValue;
        }
        else if (type === Number) {
            return +rawValue;
        }
        else if (type === BigInt) {
            return BigInt(rawValue);
        }
        else if (type === String) {
            return typeof rawValue.toString == 'function'
                ? rawValue.toString()
                : '' + rawValue;
        }
        else if (type.prototype instanceof Initializable) {
            const object = new type();
            object.setData(rawValue);
            return object;
        }
        else {
            return new type(rawValue);
        }
    }
}
exports.default = Initializable;
