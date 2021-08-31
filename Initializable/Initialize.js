"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const def_1 = require("./def");
function Initialize(mapping) {
    return function (Target) {
        Target[def_1.MappingSymbol] = mapping;
        const code = `(function ${Target.name}(...args) { const object = new Target(...args); if (args[0] instanceof Object) { object.setData(args[0]); } return object; })`;
        const Extended = eval(code);
        Extended.prototype = Target.prototype;
        Object.assign(Extended, Target);
        return Extended;
    };
}
exports.default = Initialize;
