import PropertyDescriptor from './PropertyDescriptor';

export type RecursivePartial<T> = {
    [P in keyof T]?:
        T[P] extends (infer U)[] ? RecursivePartial<U>[] :
        T[P] extends object ? RecursivePartial<T[P]> :
        T[P];
};

export type ClassConstructor<T = {}> = new (...args : any[]) => T;

export const PropertySymbol = Symbol('Property');

export const MappingSymbol = Symbol('Mapping');

export type Properties = {
    [property : string] : PropertyDescriptor
};

export type Mapping<T> = {
    [input : string] : keyof T
};
