export const ValidatorRulesSymbol = Symbol('ValidatorRules');

export type ValidationError = {
    rule : string,
    options? : any[],
};

export type ValidationRules = {
    [ruleName : number] : object
};

export type Rules = {
    date? : true,
    datetime? : {
        earliest? : Date | number | string,
        latest? : Date | number | string,
        dateOnly? : true,
    } | true,
    email? : true,
    equality? : string,
    exclusion? : any[],
    format? : string | RegExp,
    inclusion? : any[],
    length? : {
        is? : number,
        minimum? : number,
        maximum? : number,
    } | number,
    numericality? : {
        noStrings? : true,
        onlyInteger? : true,
        strict? : true,
        greaterThan? : number,
        greaterThanOrEqualTo? : number,
        equalTo? : number,
        lessThanOrEqualTo? : number,
        lessThan? : number,
        divisibleBy? : number,
        odd? : true,
        even? : true,
    } | true,
    presence? : {
        allowEmpty? : true,
    } | true,
    type? : 'array' | 'integer' | 'number' | 'string' | 'date' | 'boolean',
    url? : {
        schemes? : string[],
        allowLocal? : true,
        allowDataUrl? : true,
    } | true,
};

export type FunctionValidationDef = {
    rules : ValidationRules
    isComplex : boolean,
};

export type FunctionValidationConfig = {
    [parameterIdx : number] : FunctionValidationDef
};

export type PropertyValidationDef = {
    rules : ValidationRules,
    validateType : boolean,
};

export class ValidatableObject
    extends Object
{
    
    [ValidatorRulesSymbol]? : {
        properties : {
            [property : string] : PropertyValidationDef
        },
        methods : {
            [method : string] : FunctionValidationConfig
        }
    };
    
}
