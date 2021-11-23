import { isEmpty } from 'lodash';
import { Exception } from '../Exception';
import {
    ValidatorRulesSymbol,
    ValidatableObject,
    FunctionValidationConfig,
    ValidationRules,
    PropertyValidationDef
} from './def';
import validateJsExt from './validateJsExt';
import ValidationResult from './ValidationResult';


export default class Validator
{

    public static validateObject(
        object : ValidatableObject,
        validateAsClass? : typeof Object
    ) : ValidationResult
    {
        const TargetProto = validateAsClass
            ? validateAsClass.prototype
            : Object.getPrototypeOf(object);

        const result = new ValidationResult();
        
        // no rules applied - return
        const propertyValidationDefs : { [property : string] : PropertyValidationDef } =
            TargetProto[ValidatorRulesSymbol]?.properties;
        if (isEmpty(propertyValidationDefs)) {
            return result;
        }

        for (const property in propertyValidationDefs) {
            const propertyValidationDef = propertyValidationDefs[property];

            if (propertyValidationDef.validateType) {
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

            if (!isEmpty(propertyValidationDef.rules)) {
                // validate rules
                const validateResult = validateJsExt(
                    object,
                    { [property]: propertyValidationDef.rules },
                    { format: 'intiv' }
                );

                if (!isEmpty(validateResult)) {
                    result.properties[property] = validateResult[property];
                    result.valid = false;
                }
            }

            // validate child ojects
            if (object[property] instanceof Object) {
                const Type = Reflect.getMetadata('design:type', TargetProto, property);
                
                result.subObjects[property] = this.validateObject(object[property], Type);
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
        const ParamTypes = Reflect.getMetadata('design:paramtypes', TargetProto, method);

        const result = new ValidationResult();

        // inner object validation
        for (const parameterIdx in parameters) {
            const ParamType = ParamTypes[parameterIdx];
            const value = parameters[parameterIdx];

            if (ParamType && ParamType != Object) {
                const validateResult = this.validateObject(value, ParamType);
                if (!validateResult.valid) {
                    result.valid = false;
                    result.subObjects[parameterIdx] = validateResult;
                }
            }

        }

        const validatorRules : FunctionValidationConfig = TargetProto[ValidatorRulesSymbol].methods[method];
        if (isEmpty(validatorRules)) {
            return result;
        }

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
                    
                result.parameters[parameterIdx] = [
                    ...(result.parameters[parameterIdx] || []),
                    raw
                ];
            }

            if (
                validateParamTypes
                && !!ParamTypes[parameterIdx]
                && !this.validateType(parameters[parameterIdx], ParamTypes[parameterIdx])
            ) {
                result.valid = false;
                result.parameters[parameterIdx] = [
                    ...(result.parameters[parameterIdx] || []),
                    { rule: 'design:paramType' }
                ];
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
