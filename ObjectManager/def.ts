export const ReleaseSymbol = Symbol('Release');

export type ClassConstructor<T> = {
    new(...args : any[]) : T,
    [index : string] : any,
};

export type InjectableOptions = {
    tag? : string,
    key? : string,
    ctorArgs?: any[],
};

export class InjectionDescription
{

    public name? : string;
    public tag? : string;
    public ctorArgs : any[] = [];

    public constructor(
        public type : ClassConstructor<any>,
    )
    {}

}

export type InjectOptions = Partial<InjectionDescription>;
