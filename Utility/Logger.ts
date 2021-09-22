export default class Logger
{
    
    public constructor (
        protected serviceName : string,
    )
    {}
    
    public log (...args : any[])
    {
        console.log(`[${this.serviceName}]`, ...args);
    }
    
    public info (...args : any[])
    {
        console.info(`[${this.serviceName}]`, ...args);
    }
    
    public warn (...args : any[])
    {
        console.warn(`[${this.serviceName}]`, ...args);
    }
    
    public debug (...args : any[])
    {
        console.debug(`[${this.serviceName}]`, ...args);
    }
    
    public error (...args : any[])
    {
        console.error(`[${this.serviceName}]`, ...args);
    }
    
    public dir (...args : any[])
    {
        console.error(`[${this.serviceName}]`);
        // @ts-ignore
        console.dir(...args);
    }
    
}
