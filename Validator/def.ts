export const ValidatorRulesSymbol = Symbol('ValidatorRules');

export type ValidationError = {
    rule : string,
    options? : any[],
};

export type ValidationRules = {
    [ruleName : number] : object
};

export class ValidatableObject extends Object
{

    [ValidatorRulesSymbol]? : {
        [property : string] : {
            rules : ValidationRules,
            validateType : boolean,
        }
    };

}

export class ValidatableFunction extends Function
{

    [parameterIdx : number] : {
        rules : ValidationRules
        isComplex : boolean,
    }

}
