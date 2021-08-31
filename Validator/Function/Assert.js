"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const def_1 = require("../def");
function Assert(rules, isComplex = false) {
    return (Target, method, parameterIdx) => {
        const TargetProto = Target.constructor.prototype;
        const MethodProto = TargetProto[method];
        if (!MethodProto[def_1.ValidatorRulesSymbol]) {
            MethodProto[def_1.ValidatorRulesSymbol] = {};
        }
        if (!MethodProto[def_1.ValidatorRulesSymbol][parameterIdx]) {
            MethodProto[def_1.ValidatorRulesSymbol][parameterIdx] = {
                isComplex,
                rules: {}
            };
        }
        Object.assign(MethodProto[def_1.ValidatorRulesSymbol][parameterIdx].rules, rules);
    };
}
exports.default = Assert;
