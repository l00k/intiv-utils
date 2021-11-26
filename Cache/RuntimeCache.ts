import { Inject } from '../ObjectManager';
import { Logger } from '../Utility';


type CacheEntries = {
    [key : string] : {
        value : any,
        createdAt : number,
        lifetime : number,
    }
}

type EntryConfig = {
    lifetime? : number
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
            if (!this.entries[key].lifetime) {
                return this.entries[key].value;
            }
            
            const deltaTime = (Date.now() - this.entries[key].createdAt) / 1000;
            if (deltaTime < this.entries[key].lifetime) {
                return this.entries[key].value;
            }
        }
        
        this.entries[key] = {
            value: await entryLambda(),
            createdAt: Date.now(),
            lifetime: config.lifetime
        };
        
        return this.entries[key].value;
    }
    
    public getSync<T> (key : string, entryLambda : EntryLambda<T>, config : EntryConfig = {}) : T
    {
        config = this.prepareConfig(config);
        
        // return cached value if not expired
        if (this.entries[key]) {
            if (!this.entries[key].lifetime) {
                return this.entries[key].value;
            }
            
            const deltaTime = (Date.now() - this.entries[key].createdAt) / 1000;
            if (deltaTime < this.entries[key].lifetime) {
                return this.entries[key].value;
            }
        }
        
        this.entries[key] = {
            value: entryLambda(),
            createdAt: Date.now(),
            lifetime: config.lifetime
        };
        
        return this.entries[key].value;
    }
    
    protected prepareConfig (config : EntryConfig) : EntryConfig
    {
        return {
            lifetime: 0,
            ...config,
        };
    }
    
}
