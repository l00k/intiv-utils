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
        const globalScope = global !== undefined
            ? global
            : window;

        if (!globalScope[Configuration.STORAGE_KEY]) {
            globalScope[Configuration.STORAGE_KEY] = new Configuration();
        }

        return globalScope[Configuration.STORAGE_KEY];
    }

    public injectConfigurationValues(object : Object)
    {
        const injections = this.injections[object.constructor.prototype];
        if (injections) {
            for (const propertyName in injections) {
                const injection : InjectionDescription = injections[propertyName];
                object[propertyName] = this.get(injection.configPath, injection.defaultValue);
            }
        }
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
