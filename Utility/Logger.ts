import { inspect } from 'util';
import colors from 'colors';

export default class Logger
{
    
    public constructor (
        protected serviceName : string,
    )
    {}
    
    public log (...args : any[])
    {
        const serviceName = colors.yellow(`[${this.serviceName}]`);
        console.log(serviceName, ...args);
    }
    
    public info (...args : any[])
    {
        const serviceName = colors.yellow(`[${this.serviceName}]`);
        console.info(serviceName, ...args);
    }
    
    public warn (...args : any[])
    {
        const serviceName = colors.yellow(`[${this.serviceName}]`);
        console.warn(serviceName, ...args);
    }
    
    public debug (...args : any[])
    {
        const serviceName = colors.yellow(`[${this.serviceName}]`);
        console.debug(serviceName, ...args);
    }
    
    public error (...args : any[])
    {
        const serviceName = colors.yellow(`[${this.serviceName}]`);
        console.error(serviceName, ...args);
    }
    
    public dir (...args : any[])
    {
        const serviceName = colors.yellow(`[${this.serviceName}]`);
        console.error(serviceName);
        // @ts-ignore
        console.dir(...args);
    }
    
}
