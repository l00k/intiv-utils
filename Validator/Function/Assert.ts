import { ValidatorRulesSymbol, ValidatableFunction } from '../def';


export default function Assert(
    rules : {},
    isComplex : boolean = false
) {
    return (Target : Object, method : string, parameterIdx : number) => {
        const TargetProto = Target.constructor.prototype;
        const MethodProto : ValidatableFunction = TargetProto[method];

        if (!MethodProto[ValidatorRulesSymbol]) {
            MethodProto[ValidatorRulesSymbol] = {};
        }

        if (!MethodProto[ValidatorRulesSymbol][parameterIdx]) {
            MethodProto[ValidatorRulesSymbol][parameterIdx] = {
                isComplex,
                rules: {}
            };
        }

        Object.assign(
            MethodProto[ValidatorRulesSymbol][parameterIdx].rules,
            rules
        );
    };
}
