import { isEmpty } from 'lodash';
import { Exception } from '../Exception';
import { ValidatorRulesSymbol, ValidatableObject, ValidatableFunction } from './def';
import validateJsExt from './validateJsExt';
import ValidationResult from './ValidationResult';


export default class Validator
{

    public static validateObject(object : ValidatableObject) : ValidationResult
    {
        const TargetProto = Object.getPrototypeOf(object);

        const result = new ValidationResult();

        // no rules applied - return
        if (isEmpty(TargetProto[ValidatorRulesSymbol])) {
            return result;
        }

        for (const property in TargetProto[ValidatorRulesSymbol]) {
            const propertyRules = TargetProto[ValidatorRulesSymbol][property];

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

            if (!isEmpty(propertyRules.rules)) {
                // validate rules
                const validateResult = validateJsExt(
                    { field: object[property] },
                    { field: propertyRules.rules },
                    { format: 'intiv' }
                );

                if (!isEmpty(validateResult)) {
                    result.properties[property] = validateResult.field;
                }
            }

            // validate subojects
            if (object[property] instanceof Object) {
                (<any>result.subObjects)[property] = this.validateObject(object[property]);
                if (!result.subObjects[property].valid) {
                    result.valid = false;
                }
            }
        }

        return result;
    }

    public static validateMethod(
        Target : Object,
        method : string,
        parameters : any[],
        validateParamTypes : boolean = false
    ) : ValidationResult
    {
        const TargetProto = Target.constructor.prototype;
        const MethodProto = TargetProto[method];

        const result = new ValidationResult();

        // inner object validation
        for (const parameterIdx in parameters) {
            const value = parameters[parameterIdx];

            if (value instanceof Object) {
                const validateResult = this.validateObject(value);
                if (!validateResult.valid) {
                    (<any>result.subObjects)[parameterIdx] = validateResult;
                }
            }

        }

        const validatorRules : ValidatableFunction = MethodProto[method];
        if (isEmpty(validatorRules)) {
            return result;
        }

        // specific rules
        const ParamTypes = Reflect.getMetadata('design:paramtypes', TargetProto, method);

        for (const parameterIdx in validatorRules) {
            const isComplex = validatorRules[parameterIdx].isComplex;
            const parameterRules = validatorRules[parameterIdx].rules;
            const value = parameters[parameterIdx];

            let validateParameterResult = isComplex
                ? validateJsExt(value, parameterRules, { format: 'intiv' })
                : validateJsExt({ field: value }, { field: parameterRules }, { format: 'intiv' });

            if (!isEmpty(validateParameterResult)) {
                result.valid = false;

                const raw = isComplex
                    ? validateParameterResult
                    : validateParameterResult.field;
                result.parameters[parameterIdx].push(raw);
            }

            if (
                validateParamTypes
                && !!ParamTypes[parameterIdx]
                && !this.validateType(parameters[parameterIdx], ParamTypes[parameterIdx])
            ) {
                result.valid = false;
                result.parameters[parameterIdx].push({
                    rule: 'design:paramType'
                });
            }
        }

        return result;
    }

    public static validateType(value : any, type : any) : boolean
    {
        if (!type) {
            throw new Exception('Type has to be defined', 1573658489606);
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
