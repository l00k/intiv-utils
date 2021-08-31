import { Exception } from '../Exception';
import ValidationResult from './ValidationResult';


export default class ValidationException
    extends Exception
{

    public name : string = 'ValidationException';

    public details : ValidationResult;

    constructor(message : string, code ? : number, details? : ValidationResult)
    {
        super(message, code);
        this.details = details || this.details;
    }

}
