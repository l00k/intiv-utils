import validateJsExt from 'validate.js';
import { ValidatorRulesSymbol, ValidatableObject, Rules } from '../def';


export default function Assert(
    rules : Rules = {},
    validateType : boolean = true
) {
    return (Target : ValidatableObject, property : string) => {
        if (!Target[ValidatorRulesSymbol]) {
            Target[ValidatorRulesSymbol] = {
                properties: {},
                methods: {},
            };
        }

        if (!Target[ValidatorRulesSymbol].properties[property]) {
            Target[ValidatorRulesSymbol].properties[property] = {
                validateType,
                rules: {},
            };
        }

        Object.assign(
            Target[ValidatorRulesSymbol].properties[property].rules,
            rules
        );
    };
}
