"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const def_1 = require("./def");
function ApplyMapping() {
    return (Target, method, descriptor) => {
        const TargetProto = Target.constructor.prototype;
        const MethodProto = TargetProto[method];
        // collect default mapping
        const paramTypes = Reflect.getMetadata('design:paramtypes', Target, method);
        if (!MethodProto[def_1.MapSymbol]) {
            MethodProto[def_1.MapSymbol] = {};
        }
        for (let parameterIdx in paramTypes) {
            const paramType = paramTypes[parameterIdx];
            if (!MethodProto[def_1.MapSymbol][parameterIdx]) {
                MethodProto[def_1.MapSymbol][parameterIdx] = {
                    targetClass: paramType,
                };
            }
        }
        // apply patch to method
        let originalMethod = descriptor.value;
        descriptor.value = async function (...params) {
            for (let parameterIdx in params) {
                if (!MethodProto[def_1.MapSymbol][parameterIdx]
                    || !params[parameterIdx]) {
                    continue;
                }
                const paramMap = MethodProto[def_1.MapSymbol][parameterIdx];
                // resolve getter
                let plainValue = !!paramMap.getterCallee
                    ? await paramMap.getterCallee.call(this, ...params)
                    : params[parameterIdx];
                params[parameterIdx] = paramMap.mappingFunction(plainValue, paramMap);
            }
            return await originalMethod.apply(this, params);
        };
    };
}
exports.default = ApplyMapping;
