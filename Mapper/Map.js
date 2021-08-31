"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const def_1 = require("./def");
const MappingException_1 = tslib_1.__importDefault(require("./MappingException"));
function mapObject(plainValue, mapOptions) {
    try {
        return plainValue instanceof mapOptions.targetClass
            ? plainValue
            : class_transformer_1.plainToClass(mapOptions.targetClass, plainValue);
    }
    catch (exception) {
        throw new MappingException_1.default(exception);
    }
}
function Map(options) {
    return (Target, method, parameterIdx) => {
        const TargetProto = Target.constructor.prototype;
        const MethodProto = TargetProto[method];
        if (!MethodProto[def_1.MapSymbol]) {
            MethodProto[def_1.MapSymbol] = {};
        }
        if (!options) {
            options = {};
        }
        options.mappingFunction = mapObject;
        if (!options.targetClass) {
            const paramTypes = Reflect.getMetadata('design:paramtypes', Target, method);
            options.targetClass = paramTypes[parameterIdx];
        }
        MethodProto[def_1.MapSymbol][parameterIdx] = options;
    };
}
exports.default = Map;
