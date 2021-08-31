"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const Exception_1 = require("../Exception");
const def_1 = require("./def");
const validateJsExt_1 = tslib_1.__importDefault(require("./validateJsExt"));
const ValidationResult_1 = tslib_1.__importDefault(require("./ValidationResult"));
class Validator {
    static validateObject(object) {
        const TargetProto = Object.getPrototypeOf(object);
        const result = new ValidationResult_1.default();
        // no rules applied - return
        if (lodash_1.isEmpty(TargetProto[def_1.ValidatorRulesSymbol])) {
            return result;
        }
        for (const property in TargetProto[def_1.ValidatorRulesSymbol]) {
            const propertyRules = TargetProto[def_1.ValidatorRulesSymbol][property];
            if (propertyRules.validateType) {
                // validate property type
                const Type = Reflect.getMetadata('design:type', TargetProto, property);
                if (!this.validateType(object[property], Type)) {
                    result.valid = false;
                    if (!result.properties[property]) {
                        result.properties[property] = [];
                    }
                    result.properties[property].push({
                        rule: 'design:type'
                    });
                }
            }
            if (!lodash_1.isEmpty(propertyRules.rules)) {
                // validate rules
                const validateResult = validateJsExt_1.default({ field: object[property] }, { field: propertyRules.rules }, { format: 'intiv' });
                if (!lodash_1.isEmpty(validateResult)) {
                    result.properties[property] = validateResult.field;
                }
            }
            // validate subojects
            if (object[property] instanceof Object) {
                result.subObjects[property] = this.validateObject(object[property]);
                if (!result.subObjects[property].valid) {
                    result.valid = false;
                }
            }
        }
        return result;
    }
    static validateMethod(Target, method, parameters, validateParamTypes = false) {
        const TargetProto = Target.constructor.prototype;
        const MethodProto = TargetProto[method];
        const result = new ValidationResult_1.default();
        // inner object validation
        for (const parameterIdx in parameters) {
            const value = parameters[parameterIdx];
            if (value instanceof Object) {
                const validateResult = this.validateObject(value);
                if (!validateResult.valid) {
                    result.subObjects[parameterIdx] = validateResult;
                }
            }
        }
        const validatorRules = MethodProto[method];
        if (lodash_1.isEmpty(validatorRules)) {
            return result;
        }
        // specific rules
        const ParamTypes = Reflect.getMetadata('design:paramtypes', TargetProto, method);
        for (const parameterIdx in validatorRules) {
            const isComplex = validatorRules[parameterIdx].isComplex;
            const parameterRules = validatorRules[parameterIdx].rules;
            const value = parameters[parameterIdx];
            let validateParameterResult = isComplex
                ? validateJsExt_1.default(value, parameterRules, { format: 'intiv' })
                : validateJsExt_1.default({ field: value }, { field: parameterRules }, { format: 'intiv' });
            if (!lodash_1.isEmpty(validateParameterResult)) {
                result.valid = false;
                const raw = isComplex
                    ? validateParameterResult
                    : validateParameterResult.field;
                result.parameters[parameterIdx].push(raw);
            }
            if (validateParamTypes
                && !!ParamTypes[parameterIdx]
                && !this.validateType(parameters[parameterIdx], ParamTypes[parameterIdx])) {
                result.valid = false;
                result.parameters[parameterIdx].push({
                    rule: 'design:paramType'
                });
            }
        }
        return result;
    }
    static validateType(value, type) {
        if (!type) {
            throw new Exception_1.Exception('Type has to be defined', 1573658489606);
        }
        // null and undefined is valid here
        if (!value) {
            return true;
        }
        const valueType = typeof value;
        if (valueType != 'object') {
            //  try to map value from plain
            if (valueType == 'boolean') {
                value = new Boolean(value);
            }
            else if (valueType == 'number') {
                value = new Number(value);
            }
            else if (valueType == 'string') {
                value = new String(value);
            }
        }
        return (value instanceof type.prototype.constructor);
    }
}
exports.default = Validator;
