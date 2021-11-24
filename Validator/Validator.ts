import { isEmpty, isPlainObject } from 'lodash';
import { Exception } from '../Exception';
import {
    ValidatorSymbol,
    ValidatableObject,
    FunctionValidationConfig,
    ValidationRules,
    PropertyValidationDef, AssertObjectOptions, Rules
} from './def';
import validateJsExt from './validateJsExt';
import ValidationResult from './ValidationResult';


export default class Validator
{

    protected static initObject(Target : ValidatableObject)
    {
        if (!Target[ValidatorSymbol]) {
            Target[ValidatorSymbol] = {
                allowUnspecifiedProperties: false,
                properties: {},
                methods: {},
            };
        }
    }
    
    /**
     * Object validation related section
     */

    public static registerObjectOptions(
        Target : ValidatableObject,
        options : AssertObjectOptions = {}
    )
    {
        this.initObject(Target);
        Object.assign(Target[ValidatorSymbol], options);
    }

    public static registerObjectPropertyAssertion(
        Target : ValidatableObject,
        property : string,
        rules : Rules = {},
        validateType : boolean = true
    )
    {
        this.initObject(Target);

        if (!Target[ValidatorSymbol].properties[property]) {
            Target[ValidatorSymbol].properties[property] = {
                validateType,
                rules: {},
            };
        }

        Object.assign(
            Target[ValidatorSymbol].properties[property].rules,
            rules
        );
    }

    public static validateObject(
        object : ValidatableObject,
        validateAsClass? : typeof Object
    ) : ValidationResult
    {
        const TargetProto : typeof ValidatableObject = validateAsClass
            ? validateAsClass.prototype
            : Object.getPrototypeOf(object);

        const result = new ValidationResult();
        
        // general object assertions
        if (!TargetProto[ValidatorSymbol].allowUnspecifiedProperties) {
            for (const property in object) {
                const Type = Reflect.getMetadata('design:type', TargetProto, property);
                if (!Type) {
                    result.properties[property] = [ { rule: 'object:unspecifiedProperty' } ];
                    result.valid = false;
                }
            }
        }
        
        // no rules applied - return
        const propertyValidationDefs : { [property : string] : PropertyValidationDef } =
            TargetProto[ValidatorSymbol]?.properties;
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
                    if (!result.properties[property]) {
                        result.properties[property] = [];
                    }
                    
                    result.properties[property].push(...validateResult[property]);
                    result.valid = false;
                }
            }

            // validate child ojects
            if (object[property] instanceof Object) {
                const Type = Reflect.getMetadata('design:type', TargetProto, property);
                
                result.childObjects[property] = this.validateObject(object[property], Type);
                if (!result.childObjects[property].valid) {
                    result.valid = false;
                }
            }
        }

        return result;
    }
    
    /**
     * Method validation related section
     */
     
    public static registerMethodParameterAssertion(
        Target : ValidatableObject,
        method : string,
        parameterIdx : number,
        rules : Rules = {},
        isComplex : boolean = false
    ) {
        this.initObject(Target);
        
        if (!Target[ValidatorSymbol].methods[method]) {
            Target[ValidatorSymbol].methods[method] = {};
        }

        if (!Target[ValidatorSymbol].methods[method][parameterIdx]) {
            Target[ValidatorSymbol].methods[method][parameterIdx] = {
                rules: {},
                isComplex,
            };
        }

        Object.assign(
            Target[ValidatorSymbol].methods[method][parameterIdx].rules,
            rules
        );
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

        const validatorRules : FunctionValidationConfig = TargetProto[ValidatorSymbol].methods[method];
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
            
            const ParamType = ParamTypes[parameterIdx];
            if (ParamType && ![Object, Date, String, Boolean, Number].includes(ParamType)) {
                const validateResult = this.validateObject(value, ParamType);
                if (!validateResult.valid) {
                    result.valid = false;
                    result.childObjects[parameterIdx] = validateResult;
                }
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
