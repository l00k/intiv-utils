import 'reflect-metadata';
import { plainToClass } from 'class-transformer';
import { MapOptions, mappingFunction, MapSymbol } from './def';
import MappingException from './MappingException';



export default function Map<T>(options? : MapOptions)
{
    return (Target : Object, method : string, parameterIdx : number) => {
        const TargetProto = Target.constructor.prototype;
        const MethodProto = TargetProto[method];

        if (!MethodProto[MapSymbol]) {
            MethodProto[MapSymbol] = {};
        }

        if (!options) {
            options = {};
        }

        options.mappingFunction = mappingFunction;

        if (!options.targetClass) {
            const paramTypes = Reflect.getMetadata('design:paramtypes', Target, method);
            options.targetClass = paramTypes[parameterIdx];
        }

        MethodProto[MapSymbol][parameterIdx] = options;
    };
}
