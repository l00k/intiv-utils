import { InjectionDescription, ClassConstructor, InjectableOptions, ReleaseSymbol, InitializeSymbol } from './def';


declare const window;
declare const global;

type Services = {
    [name : string] : Object
};

type TaggableServices = {
    [tag : string] : {
        [key : string] : Object
    }
};

type Injections = Map<Object, { [propertyName : string] : InjectionDescription }>;

type Handler = (object : Object, Type : Object) => any;


export default class ObjectManager
{

    protected static readonly STORAGE_KEY = 'ObjectManager_N1Lkxd2DNNNWCPOUUOEBktEbvKzr6tmx';

    
    protected instances : Object[] = [];
    
    protected services : Services = {};
    
    protected singletons : Map<Object, any> = new Map();

    protected taggable : TaggableServices = {};

    protected handlers : Handler[] = [];


    protected singletonRegistry : Map<Object, boolean> = new Map();

    protected injectionRegistry : Injections = new Map();


    public static getSingleton() : ObjectManager
    {
        if (!globalThis[ObjectManager.STORAGE_KEY]) {
            globalThis[ObjectManager.STORAGE_KEY] = new ObjectManager();
        }

        return globalThis[ObjectManager.STORAGE_KEY];
    }

    public getInstance<T>(Klass : ClassConstructor<T>, ctorArgs : any[] = []) : T
    {
        const isSingleton = this.singletonRegistry.has(Klass);
        if (isSingleton) {
            if (!this.singletons.has(Klass)) {
                const singleton = this.createInstance(Klass);
                this.singletons.set(Klass, singleton);
            }
        
            return this.singletons.get(Klass);
        }
        
        return this.createInstance(Klass, ctorArgs);
    }

    public getService<T>(name : string) : T
    {
        if (!this.services[name]) {
            throw new Error(`Instance named as ${ name } hasn't been bonded yet`);
        }

        return <any> this.services[name];
    }

    public getServicesByTag<T>(tag : string)
    {
        return this.taggable[tag];
    }

    public bindService(service : any, name : string) : void
    {
        if (this.services[name]) {
            throw new Error(`Instance named as ${ name } already has been bonded`);
        }

        this.services[name] = service;
    }

    protected createInstance<T>(Klass : any, ctorArgs : any[] = []) : T
    {
        const object = new Klass(...ctorArgs);
        this.loadDependencies(object, Klass.prototype);
        
        // initialize
        if (object[InitializeSymbol]) {
            object[InitializeSymbol]();
        }
        
        this.instances.push(object);

        return object;
    }


    public registerInjection(
        Target : Object,
        propertyName : string,
        injectionDescription : InjectionDescription
    )
    {
        const TargetConstructor = Target.constructor;
    
        let targetInjections = this.injectionRegistry.get(TargetConstructor);
        if (!targetInjections) {
            targetInjections = {};
            this.injectionRegistry.set(TargetConstructor, targetInjections);
        }

        targetInjections[propertyName] = injectionDescription;
    }

    public registerSingleton(TargetConstructor : Object)
    {
        this.singletonRegistry.set(TargetConstructor, true);
    }

    public registerInjectable(
        Target : ClassConstructor<any>,
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
        // fetch injections from all classes in inheritance tree
        let WorkingType = Type;
        
        let targetInjections = {};
        do {
            const nodeInjections = this.injectionRegistry.get(WorkingType.constructor);
        
            targetInjections = {
                ...nodeInjections,
                ...targetInjections
            };

            WorkingType = Object.getPrototypeOf(WorkingType);
        }
        while (WorkingType !== Object.prototype);

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
        
        // external handlers
        this.handlers.forEach(handler => handler(object, Type));
    }

    public async releaseAll()
    {
        for (const service of Object.values(this.services)) {
            if (service[ReleaseSymbol]) {
                await service[ReleaseSymbol]();
            }
        }
        this.services = {};
        
        for (const instance of this.instances) {
            if (instance[ReleaseSymbol]) {
                await instance[ReleaseSymbol]();
            }
        }
        this.instances = [];
    }

}
