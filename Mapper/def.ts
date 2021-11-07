import { plainToClass } from 'class-transformer';
import MappingException from './MappingException';

export const MapSymbol = Symbol('Mapping');

type ClassConstructor<T> = {
    new(...args : any[]) : T,
    [index : string] : any,
};

export type MapOptions = {
    targetClass? : ClassConstructor<any>,
    getterCallee? : Function,
    mappingFunction? : Function,
    config? : {
        [name : string] : any
    }
};

export function mappingFunction(plainValue : any, mapOptions : MapOptions)
{
    try {
        return plainValue instanceof mapOptions.targetClass
            ? plainValue
            : plainToClass(mapOptions.targetClass, plainValue);
    }
    catch (exception) {
        throw new MappingException(<string> exception);
    }
}
