"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const def_1 = require("../def");
function Assert(rules = {}, validateType = true) {
    return (Target, property) => {
        const TargetProto = Target.constructor.prototype;
        if (!TargetProto[def_1.ValidatorRulesSymbol]) {
            TargetProto[def_1.ValidatorRulesSymbol] = {};
        }
        if (!TargetProto[def_1.ValidatorRulesSymbol][property]) {
            TargetProto[def_1.ValidatorRulesSymbol][property] = {
                validateType,
                rules: {},
            };
        }
        Object.assign(TargetProto[def_1.ValidatorRulesSymbol].properties[property].rules, rules);
    };
}
exports.default = Assert;
