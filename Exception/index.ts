export type ExceptionMetadata = {
    responseCode : number,
};


export class Throwable
    extends Error
{

    public name : string = 'Throwable';

    public code : number = 1584917642177;

    public metadata : ExceptionMetadata = {
        responseCode: 500 // general interal server error
    };

    public constructor(message : string, code ? : number, error ? : Error)
    {
        super(message);
        this.code = code || this.code;

        if (error) {
            this.initErrorMessage(message, error);
        }
    }

    public toString()
    {
        return this.name + (this.code ? ' [' + this.code + ']' : '') + ': ' + this.message;
    }

    protected initErrorMessage(message, error)
    {
        if (typeof (<any>Error).captureStackTrace === 'function') {
            (<any>Error).captureStackTrace(this, this.constructor);
        }
        else {
            this.stack = (new Error(message)).stack;
        }

        let messageLines = (this.message.match(/\n/g) || []).length + 1;
        this.stack = this.constructor.name + ': ' + message + '\n' +
            this.stack.split('\n').slice(1, messageLines + 1).join('\n')
            + '\n'
            + error.stack;
    }

}


/**
 * Exceptions
 */
export class Exception
    extends Throwable
{

    public name : string = 'Exception';

    public code : number = 1584918043677;

}


export class InitiationException
    extends Exception
{

    public name : string = 'InitiationException';

    public code : number = 1584918121810;

}


export class RuntimeException
    extends Exception
{

    public name : string = 'RuntimeException';

    public code : number = 1584918093925;

}


/**
 * Errors
 */
export class ErrorException
    extends Throwable
{

    public name : string = 'ErrorException';

    public code : number = 1584917646475;

}
