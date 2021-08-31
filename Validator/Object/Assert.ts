import { ValidatorRulesSymbol, ValidatableObject } from '../def';


export default function Assert(
    rules : {} = {},
    validateType : boolean = true
) {
    return (Target : ValidatableObject, property : string) => {
        const TargetProto = Target.constructor.prototype;

        if (!TargetProto[ValidatorRulesSymbol]) {
            TargetProto[ValidatorRulesSymbol] = {};
        }

        if (!TargetProto[ValidatorRulesSymbol][property]) {
            TargetProto[ValidatorRulesSymbol][property] = {
                validateType,
                rules: {},
            };
        }

        Object.assign(
            TargetProto[ValidatorRulesSymbol].properties[property].rules,
            rules
        );
    };
}
