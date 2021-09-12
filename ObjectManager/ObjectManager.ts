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

type Handler = (object : Object) => any;


export default class ObjectManager
{

    protected static readonly STORAGE_KEY = 'ObjectManager_N1Lkxd2DNNNWCPOUUOEBktEbvKzr6tmx';

    
    protected instances : Object[] = [];
    
    protected services : Services = {};

    protected taggable : TaggableServices = {};

    protected injections : Injections = new Map();

    protected handlers : Handler[] = [];


    public static getSingleton() : ObjectManager
    {
        if (!globalThis[ObjectManager.STORAGE_KEY]) {
            globalThis[ObjectManager.STORAGE_KEY] = new ObjectManager();
        }

        return globalThis[ObjectManager.STORAGE_KEY];
    }

    public getInstance<T>(Klass : ClassConstructor<T>, ctorArgs : any[] = []) : T
    {
        // note: possible to implement singleton here
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

        this.handlers.forEach(handler => handler(object));
        
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
    
        let targetInjections = this.injections.get(TargetConstructor);
        if (!targetInjections) {
            targetInjections = {};
            this.injections.set(TargetConstructor, targetInjections);
        }

        targetInjections[propertyName] = injectionDescription;
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
        let targetInjections = {};
        do {
            const nodeInjections = this.injections.get(Type.constructor);
        
            targetInjections = {
                ...nodeInjections,
                ...targetInjections
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
