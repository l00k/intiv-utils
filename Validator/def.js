"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatableFunction = exports.ValidatableObject = exports.ValidatorRulesSymbol = void 0;
exports.ValidatorRulesSymbol = Symbol('ValidatorRules');
class ValidatableObject extends Object {
}
exports.ValidatableObject = ValidatableObject;
class ValidatableFunction extends Function {
}
exports.ValidatableFunction = ValidatableFunction;
