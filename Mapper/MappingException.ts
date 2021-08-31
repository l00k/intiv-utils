import { Exception, ExceptionMetadata } from '../Exception';


export default class MappingException
    extends Exception
{

    public name : string = 'MappingException';

    public metadata : ExceptionMetadata = {
        responseCode: 406 // not acceptable
    };

}
