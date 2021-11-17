import { ValidatorRulesSymbol, Rules } from '../def';


export default function Assert(
    rules : Rules = {},
    isComplex : boolean = false
) {
    return (Target : Object, method : string, parameterIdx : number) => {
        if (!Target[ValidatorRulesSymbol]) {
            Target[ValidatorRulesSymbol] = {
                properties: {},
                methods: {},
            };
        }

        if (!Target[ValidatorRulesSymbol].methods[method]) {
            Target[ValidatorRulesSymbol].methods[method] = {};
        }

        if (!Target[ValidatorRulesSymbol].methods[method][parameterIdx]) {
            Target[ValidatorRulesSymbol].methods[method][parameterIdx] = {
                rules: {},
                isComplex,
            };
        }

        Object.assign(
            Target[ValidatorRulesSymbol].methods[method][parameterIdx].rules,
            rules
        );
    };
}
