import validateJsExt from 'validate.js';
import { ValidatorRulesSymbol, ValidatableObject } from '../def';


type Rules = {
    [rule : string]: any
}

export default function Assert(
    rules : Rules = {},
    validateType : boolean = true
) {
    return (Target : ValidatableObject, property : string) => {
        if (!Target[ValidatorRulesSymbol]) {
            Target[ValidatorRulesSymbol] = {};
        }

        if (!Target[ValidatorRulesSymbol][property]) {
            Target[ValidatorRulesSymbol][property] = {
                validateType,
                rules: {},
            };
        }

        Object.assign(
            Target[ValidatorRulesSymbol][property].rules,
            rules
        );
    };
}
