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
