"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const validate_js_1 = tslib_1.__importDefault(require("validate.js"));
validate_js_1.default.formatters.intiv = function (errors) {
    let result = {};
    errors.map((error) => {
        if (!result[error.attribute]) {
            result[error.attribute] = [];
        }
        result[error.attribute].push({
            rule: error.validator,
            options: error.options,
        });
    });
    return result;
};
validate_js_1.default.validators.type.types.numeric = function (value) {
    return value == Number(value);
};
exports.default = validate_js_1.default;
