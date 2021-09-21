import _ from 'lodash';
import { Exception } from '../Exception';
import { InjectionDescription } from './def';

declare const window;
declare const global;


export const ConfigurationSymbol = Symbol('');


type Injections = Map<Object, { [propertyName : string] : InjectionDescription }>;

type ConfigurationData = {
    [path : string] : any,
};


class Configuration
{

    protected static readonly STORAGE_KEY = 'Configuration_PEnYeG173bC1z4qmnXP8l3UXoYEIa1Ar';


    protected injections : Injections = new Map();

    protected data : ConfigurationData = {};


    public static getSingleton() : Configuration
    {
        if (!globalThis[Configuration.STORAGE_KEY]) {
            globalThis[Configuration.STORAGE_KEY] = new Configuration();
        }

        return globalThis[Configuration.STORAGE_KEY];
    }

    public injectConfigurationValues(object : Object, Type : Object)
    {
        const values = {};
    
        // fetch injections from all classes in inheritance tree
        let targetInjections = {};
        do {
            const injections = this.injections.get(Type);
            if (injections) {
                for (const propertyName in injections) {
                    if (values[propertyName]) {
                        continue;
                    }
                    
                    const injection : InjectionDescription = injections[propertyName];
                    values[propertyName] = this.get(injection.configPath, injection.defaultValue);
                }
            }

            Type = Object.getPrototypeOf(Type);
        }
        while (Type !== Object.prototype);
        
        Object.assign(object, values);
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


    public load(data : any, path : string = '')
    {
        this.createFlatData(path, data);
    }

    protected createFlatData(path : string, tree : any)
    {
        for (let idx in tree) {
            let nodePath = path + (path ? '.' : '') + idx;

            if (_.isObject(this.data[nodePath])) {
                _.merge(this.data[nodePath], tree[idx]);
            }
            else {
                this.data[nodePath] = tree[idx];
            }

            if (typeof tree[idx] == 'object') {
                this.createFlatData(nodePath, tree[idx]);
            }
        }
    }


    public get<T>(path : string, defaultValue ? : any) : T
    {
        if (!this.data[path]) {
            if (typeof defaultValue == 'undefined') {
                throw new Exception(`Configuration [${path}] not found and default value not defined.`, 1572874195282);
            }
            else {
                return defaultValue;
            }
        }

        return this.data[path];
    }

}


export default Configuration;
