import { plainToClass } from 'class-transformer';
import { MapOptions, MapSymbol } from './def';
import MappingException from './MappingException';


function mapObject(plainValue : any, mapOptions : MapOptions)
{
    try {
        return plainValue instanceof mapOptions.targetClass
            ? plainValue
            : plainToClass(mapOptions.targetClass, plainValue);
    }
    catch (exception) {
        throw new MappingException(exception);
    }
}

function Map<T>(options? : MapOptions)
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

        options.mappingFunction = mapObject;

        if (!options.targetClass) {
            const paramTypes = Reflect.getMetadata('design:paramtypes', Target, method);
            options.targetClass = paramTypes[parameterIdx];
        }

        MethodProto[MapSymbol][parameterIdx] = options;
    };
}

export default Map;
