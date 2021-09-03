import { InjectionDescription, ClassConstructor, InjectableOptions, ReleaseSymbol } from './def';


declare const window;
declare const global;

type Services = {
    [name : string] : any
};

type TaggableServices = {
    [tag : string] : {
        [key : string] : any
    }
};

type Injections = Map<Object, { [propertyName : string] : InjectionDescription }>;

type Handler = (object : Object) => any;


export default class ObjectManager
{

    protected static readonly STORAGE_KEY = 'ObjectManager_N1Lkxd2DNNNWCPOUUOEBktEbvKzr6tmx';


    protected instances : Services = {};

    protected taggable : TaggableServices = {};

    protected injections : Injections = new Map();

    protected handlers : Handler[] = [];


    public static getSingleton() : ObjectManager
    {
        const globalScope = global !== undefined
            ? global
            : window;

        if (!globalScope[ObjectManager.STORAGE_KEY]) {
            globalScope[ObjectManager.STORAGE_KEY] = new ObjectManager();
        }

        return globalScope[ObjectManager.STORAGE_KEY];
    }

    public getInstance<T>(Klass : ClassConstructor<T>, ctorArgs : any[] = []) : T
    {
        if (!this.instances[Klass.name]) {
            this.instances[Klass.name] = this.createInstance(Klass, ctorArgs);
        }

        return this.instances[Klass.name];
    }

    public bindInstance(object : any) : void
    {
        if (this.instances[object.name]) {
            throw new Error(`Instance typed as ${ object.name } already has been bonded`);
        }

        this.instances[object.name] = object;
    }

    public getService<T>(name : string) : T
    {
        if (!this.instances[name]) {
            throw new Error(`Instance named as ${ name } hasn't been bonded yet`);
        }

        return this.instances[name];
    }

    public getServicesByTag<T>(tag : string) : any
    {
        return this.taggable[tag];
    }

    public bindService(service : any, name : string) : void
    {
        if (this.instances[name]) {
            throw new Error(`Instance named as ${ name } already has been bonded`);
        }

        this.instances[name] = service;
    }

    protected createInstance<T>(Klass : any, ctorArgs : any[] = []) : T
    {
        const object = new Klass(...ctorArgs);
        this.loadDependencies(object, Klass.prototype);

        this.handlers.forEach(handler => handler(object));

        return object;
    }


    public registerInjection(
        Target : Object,
        propertyName : string,
        injectionDescription : InjectionDescription
    )
    {
        let targetInjections = this.injections.get(Target);
        if (!targetInjections) {
            targetInjections = {};
            this.injections.set(Target, targetInjections);
        }

        targetInjections[propertyName] = injectionDescription;
    }

    public registerInjectable(
        Target : Object,
        injectableOptions : InjectableOptions
    )
    {
        const ctorArgs = injectableOptions.ctorArgs || [];
        const instance = this.createInstance(Target, ctorArgs);

        if (injectableOptions.tag) {
            if (!this.taggable[injectableOptions.tag]) {
                this.taggable[injectableOptions.tag] = {};
            }

            this.taggable[injectableOptions.tag][injectableOptions.key] = instance;
        }
    }

    public registerHandler(handler : Handler)
    {
        this.handlers.push(handler)
    }


    public loadDependencies<T>(
        object : T,
        Type : ClassConstructor<T>
    )
    {
        let targetInjections = {};
        do {
            targetInjections = {
                ...targetInjections,
                ...this.injections.get(Type)
            };

            Type = Object.getPrototypeOf(Type);
        }
        while (Type !== Object.prototype);

        if (!targetInjections) {
            return;
        }

        for (const propertyName in targetInjections) {
            const injection : InjectionDescription = targetInjections[propertyName];

            if (injection.name) {
                object[propertyName] = this.getService(injection.name);
            }
            else if (injection.tag) {
                object[propertyName] = this.getServicesByTag(injection.tag);
            }
            else {
                object[propertyName] = this.getInstance(injection.type, injection.ctorArgs);
            }
        }
    }

    public async releaseAll()
    {
        for (const instanceName in this.instances) {
            const instance = this.instances[instanceName];
            if (instance[ReleaseSymbol]) {
                await instance[ReleaseSymbol]();
            }
            delete this.instances[instanceName];
        }
    }

}
