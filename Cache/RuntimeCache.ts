import { Inject } from '../ObjectManager';
import { Logger } from '../Utility';


type CacheEntries = {
    [key : string] : {
        value : any,
        createdAt : number,
        ttl : number,
    }
}

type EntryConfig = {
    ttl? : number
};

type EntryLambda<T> = () => T;

type EntryAsyncLambda<T> = () => Promise<T>;


export default class RuntimeCache
{
    
    @Inject({ ctorArgs: [ RuntimeCache.name ] })
    protected logger : Logger;
    
    protected entries : CacheEntries = {};
    
    
    public clear ()
    {
        return this.entries = {};
    }
    
    public async get<T> (key : string, entryLambda : EntryAsyncLambda<T>, config : EntryConfig = {}) : Promise<T>
    {
        config = this.prepareConfig(config);
        
        // return cached value if not expired
        if (this.entries[key]) {
            if (!this.entries[key].ttl) {
                return this.entries[key].value;
            }
            
            const deltaTime = (Date.now() - this.entries[key].createdAt) / 1000;
            if (deltaTime < this.entries[key].ttl) {
                return this.entries[key].value;
            }
        }
        
        this.entries[key] = {
            value: await entryLambda(),
            createdAt: Date.now(),
            ttl: config.ttl
        };
        
        return this.entries[key].value;
    }
    
    public getSync<T> (key : string, entryLambda : EntryLambda<T>, config : EntryConfig = {}) : T
    {
        config = this.prepareConfig(config);
        
        // return cached value if not expired
        if (this.entries[key]) {
            if (!this.entries[key].ttl) {
                return this.entries[key].value;
            }
            
            const deltaTime = (Date.now() - this.entries[key].createdAt) / 1000;
            if (deltaTime < this.entries[key].ttl) {
                return this.entries[key].value;
            }
        }
        
        this.entries[key] = {
            value: entryLambda(),
            createdAt: Date.now(),
            ttl: config.ttl
        };
        
        return this.entries[key].value;
    }
    
    protected prepareConfig (config : EntryConfig) : EntryConfig
    {
        return {
            ttl: 0,
            ...config,
        };
    }
    
}
