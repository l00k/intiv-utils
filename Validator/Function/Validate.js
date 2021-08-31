"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ValidationException_1 = tslib_1.__importDefault(require("../ValidationException"));
const Validator_1 = tslib_1.__importDefault(require("../Validator"));
function Validate(validateParamTypes = true, validateReturnType = false) {
    return (Target, method, descriptor) => {
        let originalMethod = descriptor.value;
        descriptor.value = function (...params) {
            const result = Validator_1.default.validateMethod(Target, method, params);
            if (!result.valid) {
                throw new ValidationException_1.default('Parameter validation using specified rules failed', 1572985034861, result);
            }
            const returnValue = originalMethod.apply(this, params);
            if (validateReturnType) {
                const ReturnType = Reflect.getMetadata('design:returntype', Target, method);
                const valid = Validator_1.default.validateType(returnValue, ReturnType);
                if (!valid) {
                    result.valid = false;
                    result.returnType = true;
                    throw new ValidationException_1.default('Return value type validation failed', 1572985055963, result);
                }
            }
            return returnValue;
        };
    };
}
exports.default = Validate;
